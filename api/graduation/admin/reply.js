// 学生回复管理 API（隐藏/显示/清空）
// PATCH /api/graduation/admin/reply — 切换隐藏状态
// DELETE /api/graduation/admin/reply — 清空回复
// Header: Authorization: Bearer <admin_token>

import { getDb } from '../_lib/db.js';
import { verifyAdminToken } from '../_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'PATCH' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

  const { studentId } = req.body || {};

  if (!studentId) {
    return res.status(400).json({ error: '缺少学生 ID' });
  }

  const db = getDb();

  if (req.method === 'PATCH') {
    const { replyHidden } = req.body;
    if (typeof replyHidden !== 'boolean') {
      return res.status(400).json({ error: 'replyHidden 必须为布尔值' });
    }

    const { data, error } = await db
      .from('graduation_students')
      .update({ reply_hidden: replyHidden, updated_at: new Date().toISOString() })
      .eq('id', studentId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: '更新失败：' + error.message });
    }

    return res.status(200).json({
      success: true,
      replyHidden: data.reply_hidden,
    });
  }

  // DELETE — 清空回复
  const { error: deleteError } = await db
    .from('graduation_replies')
    .delete()
    .eq('student_id', studentId);

  if (deleteError) {
    return res.status(500).json({ error: '清空回复失败：' + deleteError.message });
  }

  // 同时重置 reply_hidden
  await db
    .from('graduation_students')
    .update({ reply_hidden: false, updated_at: new Date().toISOString() })
    .eq('id', studentId);

  return res.status(200).json({ success: true, message: '已清空学生回复' });
}
