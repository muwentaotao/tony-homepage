// 学生提交回信 API
// POST /api/graduation/student/reply
// Header: Authorization: Bearer <student_token>
// Body: { content: string }

import { getDb } from '../_lib/db.js';
import { verifyStudentToken } from '../_lib/auth.js';

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

  let payload;
  try {
    payload = await verifyStudentToken(token);
  } catch (err) {
    return res.status(401).json({ error: '登录已过期，请重新登录' });
  }

  const studentId = payload.student_id;
  if (!studentId) {
    return res.status(401).json({ error: '无效的登录凭证' });
  }

  const db = getDb();

  // 检查板块状态
  const { data: settings } = await db
    .from('graduation_settings')
    .select('status')
    .eq('id', 1)
    .single();

  const status = settings?.status || 'closed';
  if (status === 'closed') {
    return res.status(403).json({ error: '板块已关闭' });
  }
  if (status === 'readonly') {
    return res.status(403).json({ error: '板块当前只读，不能提交回信' });
  }

  const { content } = req.body || {};
  const trimmed = typeof content === 'string' ? content.trim() : '';

  if (!trimmed) {
    return res.status(400).json({ error: '回信内容不能为空' });
  }
  if (trimmed.length > 1000) {
    return res.status(400).json({ error: '回信内容不能超过 1000 字' });
  }

  // 检查是否已回复
  const { data: existing } = await db
    .from('graduation_replies')
    .select('id')
    .eq('student_id', studentId)
    .maybeSingle();

  if (existing) {
    return res.status(409).json({ error: '你已经提交过回信了' });
  }

  // 插入回信
  const { data: reply, error: insertError } = await db
    .from('graduation_replies')
    .insert({ student_id: studentId, content: trimmed })
    .select()
    .single();

  if (insertError) {
    console.error('Reply insert error:', insertError);
    return res.status(500).json({ error: '提交失败，请稍后重试' });
  }

  return res.status(200).json({
    content: reply.content,
    createdAt: reply.created_at,
  });
}
