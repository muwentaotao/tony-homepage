// 预览模式 API（管理员查看学生页面效果，不记录登录）
// GET /api/graduation/admin/preview?studentId=xxx
// Header: Authorization: Bearer <admin_token>

import { getDb } from '../_lib/db.js';
import { verifyAdminToken } from '../_lib/auth.js';

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

  const { studentId } = req.query || {};

  if (!studentId) {
    return res.status(400).json({ error: '缺少学生 ID' });
  }

  const db = getDb();

  // 查询学生信息
  const { data: student, error: studentError } = await db
    .from('graduation_students')
    .select('*')
    .eq('id', studentId)
    .single();

  if (studentError || !student) {
    return res.status(404).json({ error: '学生不存在' });
  }

  // 查询回复
  const { data: reply } = await db
    .from('graduation_replies')
    .select('*')
    .eq('student_id', studentId)
    .maybeSingle();

  // 查询板块状态
  const { data: settings } = await db
    .from('graduation_settings')
    .select('status')
    .eq('id', 1)
    .single();

  const settingsStatus = settings?.status || 'closed';

  // 预览模式：不更新登录状态，isFirstLogin 固定为 false
  return res.status(200).json({
    name: student.name,
    className: student.class_name,
    teacherMessage: student.teacher_message,
    expectedScore: student.expected_score,
    teacherName: student.teacher_name,
    teacherMessageAt: student.teacher_message_at,
    hasLoggedIn: student.has_logged_in,
    isFirstLogin: false, // 预览时不影响逐字显示
    reply: reply ? reply.content : null,
    replyCreatedAt: reply ? reply.created_at : null,
    replyHidden: student.reply_hidden,
    hasReplied: !!reply,
    settingsStatus,
    canSubmitReply: settingsStatus === 'open' && !reply,
    isPreview: true,
  });
}
