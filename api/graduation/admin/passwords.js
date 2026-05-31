// 密码表导出 API
// GET /api/graduation/admin/passwords
// Header: Authorization: Bearer <admin_token>

import { getDb } from '../_lib/db.js';
import { verifyAdminToken } from '../_lib/auth.js';
import { decryptPassword } from '../_lib/passwords.js';
import * as XLSX from 'xlsx';

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

  const db = getDb();

  const { data: students, error } = await db
    .from('graduation_students')
    .select('name, class_name, password_encrypted, password_iv, password_auth_tag')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Password export query error:', error);
    return res.status(500).json({ error: '查询失败' });
  }

  const rows = (students || []).map((s) => {
    const password = decryptPassword(
      s.password_encrypted,
      s.password_iv,
      s.password_auth_tag
    );
    return {
      姓名: s.name,
      班级: s.class_name,
      密码: password,
      登录地址: LOGIN_URL,
    };
  });

  // 生成 Excel
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '学生密码表');

  // 设置列宽
  worksheet['!cols'] = [
    { wch: 12 },
    { wch: 15 },
    { wch: 10 },
    { wch: 35 },
  ];

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="学生密码表.xlsx"');
  res.status(200).send(buffer);
}
