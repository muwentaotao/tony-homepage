// JWT 签发与验证 — 使用 jose
// 区分 admin token 和 student token（使用不同密钥）

import { SignJWT, jwtVerify } from 'jose';
import { getEnv } from './env.js';

function getSecret(secret) {
  return new TextEncoder().encode(secret);
}

// Admin Token
export async function signAdminToken(payload) {
  const { jwtSecretAdmin } = getEnv();
  return new SignJWT({ ...payload, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(getSecret(jwtSecretAdmin));
}

export async function verifyAdminToken(token) {
  const { jwtSecretAdmin } = getEnv();
  const { payload } = await jwtVerify(token, getSecret(jwtSecretAdmin), {
    clockTolerance: 60,
  });
  if (payload.role !== 'admin') {
    throw new Error('Invalid token role');
  }
  return payload;
}

// Student Token
export async function signStudentToken(payload) {
  const { jwtSecretStudent } = getEnv();
  return new SignJWT({ ...payload, role: 'student' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getSecret(jwtSecretStudent));
}

export async function verifyStudentToken(token) {
  const { jwtSecretStudent } = getEnv();
  const { payload } = await jwtVerify(token, getSecret(jwtSecretStudent), {
    clockTolerance: 60,
  });
  if (payload.role !== 'student') {
    throw new Error('Invalid token role');
  }
  return payload;
}
