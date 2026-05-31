// 统一检查毕业板块必需的环境变量
// 在 Vercel Functions 中，缺失环境变量会直接抛错，方便排查

const REQUIRED = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'ADMIN_USERNAME',
  'ADMIN_PASSWORD_HASH',
  'JWT_SECRET_ADMIN',
  'JWT_SECRET_STUDENT',
  'PASSWORD_ENCRYPTION_KEY',
];

export function checkEnv() {
  const missing = REQUIRED.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    const err = new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
    err.code = 'MISSING_ENV';
    throw err;
  }
}

export function getEnv() {
  checkEnv();
  return {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    adminUsername: process.env.ADMIN_USERNAME,
    adminPasswordHash: process.env.ADMIN_PASSWORD_HASH,
    jwtSecretAdmin: process.env.JWT_SECRET_ADMIN,
    jwtSecretStudent: process.env.JWT_SECRET_STUDENT,
    passwordEncryptionKey: process.env.PASSWORD_ENCRYPTION_KEY,
  };
}
