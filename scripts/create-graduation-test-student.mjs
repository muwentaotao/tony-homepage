#!/usr/bin/env node
// 创建测试学生数据（仅用于本地开发）
// 用法：node scripts/create-graduation-test-student.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { randomBytes, createCipheriv } from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// 读取 .env.local
function loadEnv() {
  const envPath = path.join(rootDir, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('错误：找不到 .env.local，请先在项目根目录创建并配置环境变量。');
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const match = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
    if (match) env[match[1]] = match[2].trim();
  }
  return env;
}

const env = loadEnv();

const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'PASSWORD_ENCRYPTION_KEY'];
for (const key of required) {
  if (!env[key]) {
    console.error(`错误：.env.local 中缺少 ${key}`);
    process.exit(1);
  }
}

// Supabase 客户端
const db = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// 生成密码
function generatePassword() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

// bcrypt hash
function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

// AES-256-GCM 加密
function encryptPassword(password, keyBase64) {
  const key = Buffer.from(keyBase64, 'base64');
  if (key.length !== 32) {
    throw new Error(`PASSWORD_ENCRYPTION_KEY 解码后必须是 32 字节，当前 ${key.length} 字节`);
  }
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(password, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const authTag = cipher.getAuthTag();
  return {
    encrypted,
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
  };
}

async function main() {
  const password = generatePassword();
  const passwordHash = hashPassword(password);
  const encrypted = encryptPassword(password, env.PASSWORD_ENCRYPTION_KEY);

  const student = {
    name: '测试学生',
    class_name: '初三(1)班',
    teacher_message: '亲爱的同学，三年的时光转瞬即逝。愿你带着自信和从容走进考场，老师相信你一定能取得理想的成绩！无论结果如何，你都是老师心中最棒的学生。',
    expected_score: '85+',
    teacher_name: 'Tony',
    teacher_message_at: new Date().toISOString(),
    password_hash: passwordHash,
    password_encrypted: encrypted.encrypted,
    password_iv: encrypted.iv,
    password_auth_tag: encrypted.authTag,
  };

  const { data, error } = await db.from('graduation_students').insert(student).select().single();

  if (error) {
    console.error('插入失败:', error.message);
    process.exit(1);
  }

  console.log('\n✅ 测试学生创建成功！\n');
  console.log('──────────────────────────────');
  console.log('姓名:', data.name);
  console.log('班级:', data.class_name);
  console.log('密码:', password);
  console.log('登录地址: /graduation');
  console.log('──────────────────────────────');
  console.log('\n⚠️  请把密码复制保存好，这是唯一一次能看到明文密码的机会。');
  console.log('\n测试登录命令：');
  console.log(`curl -X POST http://localhost:5173/api/graduation/student/login \\\n  -H "Content-Type: application/json" \\\n  -d '{"name":"${data.name}","password":"${password}"}'`);
}

main().catch((err) => {
  console.error('脚本出错:', err.message);
  process.exit(1);
});
