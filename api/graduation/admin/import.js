// Excel 批量导入学生 API
// POST /api/graduation/admin/import
// Header: Authorization: Bearer <admin_token>
// Body: multipart/form-data, file: .xlsx

import { getDb } from '../_lib/db.js';
import { verifyAdminToken } from '../_lib/auth.js';
import { generatePassword, hashPassword, encryptPassword } from '../_lib/passwords.js';
import * as XLSX from 'xlsx';

const REQUIRED_HEADERS = ['姓名', '班级', '老师留言', '期望分数', '老师署名'];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');

  if (!token) {
    return res.status(401).json({ error: '未登录' });
  }

  try {
    await verifyAdminToken(token);
  } catch (err) {
    return res.status(401).json({ error: '登录已过期，请重新登录' });
  }

  try {
    // Vercel Functions 中 multipart 解析需要特殊处理
    // 这里采用 base64 字符串方式：前端读取文件为 ArrayBuffer → base64 → 后端还原
    const { fileBase64 } = req.body || {};

    if (!fileBase64) {
      return res.status(400).json({ error: '请上传 Excel 文件' });
    }

    // base64 解码
    const buffer = Buffer.from(fileBase64, 'base64');
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

    if (rows.length < 2) {
      return res.status(400).json({ error: 'Excel 文件为空或缺少数据' });
    }

    // 校验表头
    const headers = rows[0].map((h) => String(h).trim());
    const missingHeaders = REQUIRED_HEADERS.filter((h) => !headers.includes(h));
    if (missingHeaders.length > 0) {
      return res.status(400).json({
        error: `Excel 表头缺失：${missingHeaders.join('、')}`,
        required: REQUIRED_HEADERS,
        found: headers,
      });
    }

    const colIndex = {};
    REQUIRED_HEADERS.forEach((h) => {
      colIndex[h] = headers.indexOf(h);
    });

    // 解析数据行
    const students = [];
    const errors = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      // 跳过完全空行
      if (!row || row.every((cell) => !String(cell).trim())) continue;

      const name = String(row[colIndex['姓名']] || '').trim();
      const className = String(row[colIndex['班级']] || '').trim();
      const teacherMessage = String(row[colIndex['老师留言']] || '').trim();
      const expectedScore = String(row[colIndex['期望分数']] || '').trim();
      const teacherName = String(row[colIndex['老师署名']] || '').trim();

      const rowNum = i + 1;

      if (!name) errors.push(`第 ${rowNum} 行：姓名不能为空`);
      if (!className) errors.push(`第 ${rowNum} 行：班级不能为空`);
      if (!teacherMessage) errors.push(`第 ${rowNum} 行：老师留言不能为空`);
      if (!teacherName) errors.push(`第 ${rowNum} 行：老师署名不能为空`);

      if (name) {
        students.push({
          name,
          class_name: className,
          teacher_message: teacherMessage,
          expected_score: expectedScore || null,
          teacher_name: teacherName,
        });
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: '导入数据存在错误，请修正后重新上传',
        errors,
      });
    }

    if (students.length === 0) {
      return res.status(400).json({ error: '未找到有效的学生数据' });
    }

    const db = getDb();

    // 检查同名冲突
    const names = students.map((s) => s.name);
    const { data: existing } = await db
      .from('graduation_students')
      .select('name')
      .in('name', names);

    if (existing && existing.length > 0) {
      const dupNames = existing.map((e) => e.name);
      return res.status(400).json({
        error: `以下学生已存在，请手动处理：${dupNames.join('、')}`,
        duplicateNames: dupNames,
      });
    }

    // 生成密码并组装插入数据
    const now = new Date().toISOString();
    const insertData = students.map((s) => {
      const password = generatePassword();
      const passwordHash = hashPassword(password);
      const encrypted = encryptPassword(password);

      return {
        ...s,
        teacher_message_at: now,
        password_hash: passwordHash,
        password_encrypted: encrypted.encrypted,
        password_iv: encrypted.iv,
        password_auth_tag: encrypted.authTag,
      };
    });

    const { data: inserted, error: insertError } = await db
      .from('graduation_students')
      .insert(insertData)
      .select();

    if (insertError) {
      console.error('Import insert error:', insertError);
      return res.status(500).json({ error: '导入失败：' + insertError.message });
    }

    return res.status(200).json({
      success: true,
      count: inserted.length,
      message: `成功导入 ${inserted.length} 名学生，请前往导出密码表`,
    });
  } catch (err) {
    console.error('Import error:', err);
    return res.status(500).json({ error: '导入处理失败：' + err.message });
  }
}
