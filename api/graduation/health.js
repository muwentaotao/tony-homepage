// API 探针 — 检查毕业板块后端服务状态
// GET /api/graduation/health

import { getDb } from './_lib/db.js';

export default async function handler(req, res) {
  // 允许 CORS（本地开发时前端可能跨域请求）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const result = {
    ok: true,
    service: 'graduation',
    time: new Date().toISOString(),
    env: 'unknown',
    db: 'unknown',
  };

  // 检查环境变量
  const missingEnv = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'ADMIN_USERNAME',
    'ADMIN_PASSWORD_HASH',
    'JWT_SECRET_ADMIN',
    'JWT_SECRET_STUDENT',
    'PASSWORD_ENCRYPTION_KEY',
  ].filter((key) => !process.env[key]);

  if (missingEnv.length > 0) {
    result.ok = false;
    result.env = 'missing';
    result.missingEnv = missingEnv;
    return res.status(503).json(result);
  }

  result.env = 'ready';

  // 尝试连接数据库
  try {
    const db = getDb();
    const { data, error } = await db
      .from('graduation_settings')
      .select('id')
      .eq('id', 1)
      .single();

    if (error) {
      result.db = 'error';
      result.dbError = error.message;
      // 数据库连不上不一定是服务不可用，可能是表还没建
      return res.status(200).json(result);
    }

    result.db = 'connected';
    return res.status(200).json(result);
  } catch (err) {
    result.db = 'exception';
    result.dbError = err.message;
    return res.status(200).json(result);
  }
}
