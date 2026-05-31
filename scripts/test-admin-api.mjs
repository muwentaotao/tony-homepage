#!/usr/bin/env node
// 测试管理员 API

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const match = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim();
    }
  }
}

import bcrypt from 'bcryptjs';
import loginHandler from '../api/graduation/admin/login.js';
import studentsHandler from '../api/graduation/admin/students.js';
import settingsHandler from '../api/graduation/admin/settings.js';

// 如果现有 hash 不匹配已知密码，生成一个测试用 hash
const testPassword = 'testpass';
if (!bcrypt.compareSync(testPassword, process.env.ADMIN_PASSWORD_HASH)) {
  process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync(testPassword, 10);
}

function createRes() {
  let statusCode = 200;
  let jsonBody = null;
  return {
    setHeader() { return this; },
    status(code) { statusCode = code; return this; },
    json(body) { jsonBody = body; return this; },
    end() { return this; },
    getStatus() { return statusCode; },
    getBody() { return jsonBody; },
  };
}

async function test(name, handler, req) {
  const res = createRes();
  try {
    await handler(req, res);
    console.log(`\n[${name}]`);
    console.log('  Status:', res.getStatus());
    const body = res.getBody();
    if (body?.students) {
      console.log('  Students count:', body.students.length);
    } else if (body?.status) {
      console.log('  Status:', body.status);
    } else {
      console.log('  Body:', JSON.stringify(body, null, 2));
    }
    return { status: res.getStatus(), body };
  } catch (err) {
    console.error(`\n[${name}] ERROR:`, err.message);
    return { status: 500, error: err.message };
  }
}

async function main() {
  console.log('========== 管理员 API 测试开始 ==========');

  // 1. 错误密码
  await test('错误密码', loginHandler, {
    method: 'POST',
    body: { username: 'teacher', password: 'wrongpass' },
    headers: {},
  });

  // 2. 正确登录
  const loginRes = await test('正确登录', loginHandler, {
    method: 'POST',
    body: { username: 'teacher', password: 'testpass' },
    headers: {},
  });

  if (!loginRes.body?.token) {
    console.error('\n❌ 管理员登录失败，跳过后续测试');
    return;
  }

  const token = loginRes.body.token;
  console.log('  ✅ 获取 admin token');

  // 3. 无 token 访问学生列表
  await test('学生列表（无token）', studentsHandler, {
    method: 'GET',
    headers: {},
  });

  // 4. 学生列表（正确 token）
  const listRes = await test('学生列表（正确token）', studentsHandler, {
    method: 'GET',
    headers: { authorization: `Bearer ${token}` },
  });

  // 5. 搜索筛选
  await test('学生列表（keyword筛选）', studentsHandler, {
    method: 'GET',
    headers: { authorization: `Bearer ${token}` },
    query: { keyword: '测试' },
  });

  // 6. 读取设置
  const getSettings = await test('读取设置', settingsHandler, {
    method: 'GET',
    headers: { authorization: `Bearer ${token}` },
  });

  // 7. 切换设置
  await test('切换设置为readonly', settingsHandler, {
    method: 'PUT',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: { status: 'readonly' },
  });

  // 8. 验证切换成功
  const afterSwitch = await test('验证设置已切换', settingsHandler, {
    method: 'GET',
    headers: { authorization: `Bearer ${token}` },
  });

  if (afterSwitch.body?.status === 'readonly') {
    console.log('  ✅ 状态切换成功');
  } else {
    console.error('  ❌ 状态切换失败');
  }

  // 9. 恢复为 open
  await test('恢复为open', settingsHandler, {
    method: 'PUT',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: { status: 'open' },
  });

  console.log('\n========== 测试结束 ==========');
}

main().catch((err) => {
  console.error('测试脚本出错:', err);
  process.exit(1);
});
