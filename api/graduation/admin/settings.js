// 板块状态 API（管理员专用）
// GET /api/graduation/admin/settings  — 读取状态
// PUT /api/graduation/admin/settings  — 切换状态
// Header: Authorization: Bearer <admin_token>

import { getDb } from '../_lib/db.js';
import { verifyAdminToken } from '../_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET' && req.method !== 'PUT') {
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

  const db = getDb();

  if (req.method === 'GET') {
    const { data, error } = await db
      .from('graduation_settings')
      .select('status, updated_at')
      .eq('id', 1)
      .single();

    if (error) {
      return res.status(500).json({ error: '查询失败' });
    }

    return res.status(200).json(data);
  }

  // PUT
  const { status } = req.body || {};
  const allowed = ['open', 'readonly', 'closed'];

  if (!allowed.includes(status)) {
    return res.status(400).json({ error: '无效的状态值' });
  }

  const { data, error } = await db
    .from('graduation_settings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', 1)
    .select()
    .single();

  if (error) {
    console.error('Settings update error:', error);
    return res.status(500).json({ error: '更新失败' });
  }

  return res.status(200).json(data);
}
