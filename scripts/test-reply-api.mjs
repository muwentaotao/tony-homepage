#!/usr/bin/env node
// 测试提交回信 API

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
import replyHandler from '../api/graduation/student/reply.js';

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
    console.log('  Body:', JSON.stringify(res.getBody(), null, 2));
    return { status: res.getStatus(), body: res.getBody() };
  } catch (err) {
    console.error(`\n[${name}] ERROR:`, err.message);
    return { status: 500, error: err.message };
  }
}

async function main() {
  console.log('========== 回信 API 测试开始 ==========');

  // 1. 登录获取 token
  const loginRes = await test('登录获取token', loginHandler, {
    method: 'POST',
    body: { name: '测试学生', password: '1549' },
    headers: {},
  });

  if (!loginRes.body?.token) {
    console.error('登录失败，跳过后续测试');
    return;
  }
  const token = loginRes.body.token;

  // 2. 提交有效回信
  await test('提交有效回信', replyHandler, {
    method: 'POST',
    body: { content: '  谢谢老师的留言，我会努力的！  ' },
    headers: { authorization: `Bearer ${token}` },
  });

  // 3. 重复提交（应 409）
  await test('重复提交（应409）', replyHandler, {
    method: 'POST',
    body: { content: '第二次提交' },
    headers: { authorization: `Bearer ${token}` },
  });

  // 4. 空内容（应 400）
  await test('空内容（应400）', replyHandler, {
    method: 'POST',
    body: { content: '   ' },
    headers: { authorization: `Bearer ${token}` },
  });

  // 5. 超长内容（应 400）
  await test('超长内容（应400）', replyHandler, {
    method: 'POST',
    body: { content: 'a'.repeat(1001) },
    headers: { authorization: `Bearer ${token}` },
  });

  // 6. 无 token（应 401）
  await test('无token（应401）', replyHandler, {
    method: 'POST',
    body: { content: '测试' },
    headers: {},
  });

  console.log('\n========== 测试结束 ==========');
}

main().catch((err) => {
  console.error('测试脚本出错:', err);
  process.exit(1);
});
