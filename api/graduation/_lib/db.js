// Supabase Server Client — 仅在 Vercel Functions 中使用
// 使用 Service Role Key，拥有绕过 RLS 的权限

import { createClient } from '@supabase/supabase-js';
import { getEnv } from './env.js';

let _client = null;

export function getDb() {
  if (_client) return _client;

  const { supabaseUrl, supabaseServiceRoleKey } = getEnv();

  _client = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return _client;
}
