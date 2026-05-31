// 学生登录 API
// POST /api/graduation/student/login
// Body: { name: string, password: string }

import { getDb } from '../_lib/db.js';
import { verifyPassword } from '../_lib/passwords.js';
import { signStudentToken } from '../_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, password } = req.body || {};

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: '姓名或密码错误' });
  }
  if (!password || !/^\d{4}$/.test(password)) {
    return res.status(400).json({ error: '姓名或密码错误' });
  }

  const db = getDb();

  // 严格匹配姓名
  const { data: student, error: findError } = await db
    .from('graduation_students')
    .select('*')
    .eq('name', name.trim())
    .single();

  if (findError || !student) {
    return res.status(401).json({ error: '姓名或密码错误' });
  }

  // 验证密码
  const valid = verifyPassword(password, student.password_hash);
  if (!valid) {
    return res.status(401).json({ error: '姓名或密码错误' });
  }

  // 判断是否是第一次登录
  const isFirstLogin = !student.has_logged_in;
  const now = new Date().toISOString();

  // 更新登录状态
  const updates = {
    has_logged_in: true,
    last_logged_in_at: now,
  };
  if (isFirstLogin) {
    updates.first_logged_in_at = now;
  }

  const { error: updateError } = await db
    .from('graduation_students')
    .update(updates)
    .eq('id', student.id);

  if (updateError) {
    console.error('Login update error:', updateError);
    return res.status(500).json({ error: '登录失败，请稍后重试' });
  }

  // 签发 JWT
  const token = await signStudentToken({ student_id: student.id });

  return res.status(200).json({
    token,
    isFirstLogin,
  });
}
