// 密码表导出 API
// GET /api/graduation/admin/passwords
// Header: Authorization: Bearer <admin_token>

import { getDb } from '../_lib/db.js';
import { verifyAdminToken } from '../_lib/auth.js';
import { decryptPassword } from '../_lib/passwords.js';

const LOGIN_URL = 'https://muwentao.com/graduation';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

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
    const db = getDb();

    const { data: students, error } = await db
      .from('graduation_students')
      .select('name, class_name, password_encrypted, password_iv, password_auth_tag')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Password export query error:', error);
      return res.status(500).json({ error: '数据库查询失败: ' + error.message });
    }

    // 生成 CSV
    const headers = ['姓名', '班级', '密码', '登录地址'];
    const lines = [headers.join(',')];

    for (const s of students || []) {
      const password = decryptPassword(
        s.password_encrypted,
        s.password_iv,
        s.password_auth_tag
      );
      // CSV 字段中包含逗号时需要加引号
      const row = [
        `"${s.name}"`,
        `"${s.class_name}"`,
        `"${password}"`,
        `"${LOGIN_URL}"`,
      ];
      lines.push(row.join(','));
    }

    const csv = '\uFEFF' + lines.join('\n'); // BOM 让 Excel 正确识别中文

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="学生密码表.csv"');
    res.status(200).end(csv);
  } catch (err) {
    console.error('Password export unexpected error:', err);
    return res.status(500).json({ error: '导出失败: ' + (err.message || '未知错误') });
  }
}
