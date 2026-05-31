// 管理员登录 API
// POST /api/graduation/admin/login
// Body: { username: string, password: string }

import { getEnv } from '../_lib/env.js';
import { verifyPassword } from '../_lib/passwords.js';
import { signAdminToken } from '../_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: '账号或密码错误' });
  }

  const { adminUsername, adminPasswordHash } = getEnv();

  if (username.trim() !== adminUsername) {
    return res.status(401).json({ error: '账号或密码错误' });
  }

  const valid = verifyPassword(password, adminPasswordHash);
  if (!valid) {
    return res.status(401).json({ error: '账号或密码错误' });
  }

  const token = await signAdminToken({ role: 'admin' });

  return res.status(200).json({ token });
}
