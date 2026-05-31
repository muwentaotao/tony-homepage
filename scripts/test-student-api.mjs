#!/usr/bin/env node
// 本地测试学生 API（不依赖 Vercel dev server，直接调用 handler）

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 加载 .env.local
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

import loginHandler from '../api/graduation/student/login.js';
import messageHandler from '../api/graduation/student/message.js';

function createRes() {
  let statusCode = 200;
  let jsonBody = null;
  const headers = {};

  return {
    setHeader(k, v) { headers[k] = v; },
    status(code) { statusCode = code; return this; },
    json(body) { jsonBody = body; return this; },
    end() { return this; },
    getStatus() { return statusCode; },
    getBody() { return jsonBody; },
    getHeaders() { return headers; },
  };
}

async function test(name, handler, req) {
  const res = createRes();
  try {
    await handler(req, res);
    const body = res.getBody();
    console.log(`\n[${name}]`);
    console.log('  Status:', res.getStatus());
    console.log('  Body:', JSON.stringify(body, null, 2));
    return { status: res.getStatus(), body };
  } catch (err) {
    console.error(`\n[${name}] ERROR:`, err.message);
    return { status: 500, error: err.message };
  }
}

async function main() {
  console.log('========== 学生 API 测试开始 ==========');

  // 1. 正确登录
  const loginOk = await test('正确登录', loginHandler, {
    method: 'POST',
    body: { name: '测试学生', password: '1549' },
    headers: {},
  });

  if (!loginOk.body?.token) {
    console.error('\n❌ 正确登录失败，后续测试跳过');
    return;
  }

  const token = loginOk.body.token;
  const isFirstLogin = loginOk.body.isFirstLogin;
  console.log(isFirstLogin ? '  ✅ 第一次登录' : '  ⚠️ 非第一次登录');

  // 2. 错误密码
  await test('错误密码', loginHandler, {
    method: 'POST',
    body: { name: '测试学生', password: '0000' },
    headers: {},
  });

  // 3. 错误姓名
  await test('错误姓名', loginHandler, {
    method: 'POST',
    body: { name: '不存在的姓名', password: '1549' },
    headers: {},
  });

  // 4. 获取留言（正确 token）
  const msgOk = await test('获取留言（正确token）', messageHandler, {
    method: 'GET',
    headers: { authorization: `Bearer ${token}` },
  });

  if (msgOk.body?.name === '测试学生') {
    console.log('  ✅ 只能拿到自己的留言');
  } else {
    console.error('  ❌ 留言数据异常');
  }

  // 5. 获取留言（无 token）
  await test('获取留言（无token）', messageHandler, {
    method: 'GET',
    headers: {},
  });

  // 6. 获取留言（错误 token）
  await test('获取留言（错误token）', messageHandler, {
    method: 'GET',
    headers: { authorization: 'Bearer fake.token.here' },
  });

  // 7. 再次登录，验证 isFirstLogin 变为 false
  const loginAgain = await test('再次登录（验证非首次）', loginHandler, {
    method: 'POST',
    body: { name: '测试学生', password: '1549' },
    headers: {},
  });

  if (loginAgain.body?.isFirstLogin === false) {
    console.log('  ✅ 再次登录返回 isFirstLogin = false');
  } else {
    console.error('  ❌ 再次登录状态异常:', loginAgain.body?.isFirstLogin);
  }

  console.log('\n========== 测试结束 ==========');
}

main().catch((err) => {
  console.error('测试脚本出错:', err);
  process.exit(1);
});
