// 密码处理：生成、bcrypt 校验、AES-256-GCM 加解密（用于后台导出）

import bcrypt from 'bcryptjs';
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';
import { getEnv } from './env.js';

const AES_ALGO = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

// 生成 1000–9999 的随机四位数密码
export function generatePassword() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

// bcrypt hash（用于登录校验）
export function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

// 从 base64 编码的密钥字符串获取 32 字节 Buffer
function getKeyBuffer() {
  const { passwordEncryptionKey } = getEnv();
  const buf = Buffer.from(passwordEncryptionKey, 'base64');
  if (buf.length !== 32) {
    throw new Error(
      `PASSWORD_ENCRYPTION_KEY must decode to 32 bytes, got ${buf.length}`
    );
  }
  return buf;
}

// AES-256-GCM 加密（返回 base64 字符串）
export function encryptPassword(plainPassword) {
  const key = getKeyBuffer();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(AES_ALGO, key, iv);

  let encrypted = cipher.update(plainPassword, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  const authTag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
  };
}

// AES-256-GCM 解密（返回明文四位数密码）
export function decryptPassword(encrypted, iv, authTag) {
  const key = getKeyBuffer();
  const decipher = createDecipheriv(
    AES_ALGO,
    key,
    Buffer.from(iv, 'base64')
  );
  decipher.setAuthTag(Buffer.from(authTag, 'base64'));

  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
