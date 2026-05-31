// 学生列表 API（管理员专用）
// GET /api/graduation/admin/students
// Header: Authorization: Bearer <admin_token>
// Query: keyword, className, hasLoggedIn, hasReplied, replyHidden

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

  const db = getDb();

  // 获取所有学生（含回复）
  const { data: students, error } = await db
    .from('graduation_students')
    .select(`
      id,
      name,
      class_name,
      expected_score,
      teacher_name,
      teacher_message_at,
      has_logged_in,
      first_logged_in_at,
      last_logged_in_at,
      reply_hidden,
      created_at,
      graduation_replies (content, created_at)
    `)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Admin students query error:', error);
    return res.status(500).json({ error: '查询失败' });
  }

  // 格式化数据
  let result = (students || []).map((s) => {
    const reply = s.graduation_replies?.[0] || null;
    return {
      id: s.id,
      name: s.name,
      className: s.class_name,
      expectedScore: s.expected_score,
      teacherName: s.teacher_name,
      teacherMessageAt: s.teacher_message_at,
      hasLoggedIn: s.has_logged_in,
      firstLoggedInAt: s.first_logged_in_at,
      lastLoggedInAt: s.last_logged_in_at,
      hasReplied: !!reply,
      replyCreatedAt: reply?.created_at || null,
      replyHidden: s.reply_hidden,
      replyContent: reply?.content || null,
    };
  });

  // 筛选
  const { keyword, className, hasLoggedIn, hasReplied, replyHidden } = req.query || {};

  if (keyword) {
    const k = keyword.trim().toLowerCase();
    result = result.filter((s) => s.name.toLowerCase().includes(k));
  }

  if (className && className !== 'all') {
    result = result.filter((s) => s.className === className);
  }

  if (hasLoggedIn === 'true') {
    result = result.filter((s) => s.hasLoggedIn);
  } else if (hasLoggedIn === 'false') {
    result = result.filter((s) => !s.hasLoggedIn);
  }

  if (hasReplied === 'true') {
    result = result.filter((s) => s.hasReplied);
  } else if (hasReplied === 'false') {
    result = result.filter((s) => !s.hasReplied);
  }

  if (replyHidden === 'true') {
    result = result.filter((s) => s.replyHidden);
  } else if (replyHidden === 'false') {
    result = result.filter((s) => !s.replyHidden);
  }

  return res.status(200).json({ students: result });
}
