// 学生信息编辑 API
// PATCH /api/graduation/admin/student
// Header: Authorization: Bearer <admin_token>

import { getDb } from '../_lib/db.js';
import { verifyAdminToken } from '../_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'PATCH') return res.status(405).json({ error: 'Method not allowed' });

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

  const {
    id,
    name,
    className,
    teacherMessage,
    expectedScore,
    teacherName,
    teacherMessageAt,
  } = req.body || {};

  if (!id) {
    return res.status(400).json({ error: '缺少学生 ID' });
  }

  if (!name || !className || !teacherMessage || !teacherName) {
    return res.status(400).json({ error: '姓名、班级、老师留言、老师署名为必填项' });
  }

  const db = getDb();

  // 检查同名冲突（排除自己）
  const { data: existing } = await db
    .from('graduation_students')
    .select('id, name')
    .eq('name', name.trim())
    .neq('id', id)
    .maybeSingle();

  if (existing) {
    return res.status(409).json({ error: `已存在名为「${name}」的学生` });
  }

  const updates = {
    name: name.trim(),
    class_name: className.trim(),
    teacher_message: teacherMessage.trim(),
    expected_score: expectedScore ? String(expectedScore).trim() : null,
    teacher_name: teacherName.trim(),
    updated_at: new Date().toISOString(),
  };

  if (teacherMessageAt) {
    updates.teacher_message_at = teacherMessageAt;
  }

  const { data, error } = await db
    .from('graduation_students')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Student update error:', error);
    return res.status(500).json({ error: '更新失败：' + error.message });
  }

  return res.status(200).json(data);
}
