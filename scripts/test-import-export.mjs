#!/usr/bin/env node
// 测试 Excel 导入 + 密码导出 API

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as XLSX from 'xlsx';
import bcrypt from 'bcryptjs';

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

// 如果现有 admin hash 不匹配已知密码，生成测试用 hash
if (!bcrypt.compareSync('testpass', process.env.ADMIN_PASSWORD_HASH)) {
  process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync('testpass', 10);
}

import loginHandler from '../api/graduation/admin/login.js';
import importHandler from '../api/graduation/admin/import.js';
import passwordsHandler from '../api/graduation/admin/passwords.js';
import studentLoginHandler from '../api/graduation/student/login.js';

function createRes() {
  let statusCode = 200;
  let jsonBody = null;
  let sentBuffer = null;
  return {
    setHeader() { return this; },
    status(code) { statusCode = code; return this; },
    json(body) { jsonBody = body; return this; },
    send(buf) { sentBuffer = buf; return this; },
    end() { return this; },
    getStatus() { return statusCode; },
    getBody() { return jsonBody; },
    getBuffer() { return sentBuffer; },
  };
}

async function test(name, handler, req) {
  const res = createRes();
  try {
    await handler(req, res);
    console.log(`\n[${name}]`);
    console.log('  Status:', res.getStatus());
    const body = res.getBody();
    if (body) console.log('  Body:', JSON.stringify(body, null, 2));
    return { status: res.getStatus(), body, buffer: res.getBuffer() };
  } catch (err) {
    console.error(`\n[${name}] ERROR:`, err.message);
    return { status: 500, error: err.message };
  }
}

function generateExcel(rows) {
  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  return Buffer.from(buf).toString('base64');
}

async function main() {
  console.log('========== 导入导出 API 测试开始 ==========');

  // 1. 管理员登录
  const loginRes = await test('管理员登录', loginHandler, {
    method: 'POST',
    body: { username: 'teacher', password: 'testpass' },
    headers: {},
  });
  if (!loginRes.body?.token) {
    console.error('登录失败，跳过测试');
    return;
  }
  const token = loginRes.body.token;

  // 2. 测试缺列表头
  const badHeaderExcel = generateExcel([['姓名', '班级', '期望分数']]);
  await test('缺列表头', importHandler, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: { fileBase64: badHeaderExcel },
  });

  // 3. 测试空姓名
  const emptyNameExcel = generateExcel([
    ['姓名', '班级', '老师留言', '期望分数', '老师署名'],
    ['', '初三(2)班', '加油', '90+', 'Tony'],
  ]);
  await test('空姓名', importHandler, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: { fileBase64: emptyNameExcel },
  });

  // 4. 正确导入
  const goodExcel = generateExcel([
    ['姓名', '班级', '老师留言', '期望分数', '老师署名'],
    ['李华', '初三(2)班', '李华同学，你的努力老师都看在眼里，中考加油！', '90+', 'Tony'],
    ['王芳', '初三(2)班', '王芳同学，相信自己，你是最棒的！', '85+', 'Tony'],
  ]);
  const importRes = await test('正确导入', importHandler, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: { fileBase64: goodExcel },
  });

  if (!importRes.body?.success) {
    console.error('导入失败，跳过后续测试');
    return;
  }

  // 5. 重复导入（同名冲突）
  const dupRes = await test('重复导入（同名冲突）', importHandler, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: { fileBase64: goodExcel },
  });

  if (dupRes.body?.duplicateNames) {
    console.log('  ✅ 同名冲突检测正常');
  }

  // 6. 导出密码表
  const exportRes = await test('导出密码表', passwordsHandler, {
    method: 'GET',
    headers: { authorization: `Bearer ${token}` },
  });

  if (exportRes.buffer) {
    console.log('  ✅ 导出文件大小:', exportRes.buffer.length, 'bytes');
  }

  // 7. 验证导入的学生能登录（用李华）
  // 先获取李华的密码 - 由于无法直接从 API 获取，我们通过导出文件解析
  if (exportRes.buffer) {
    const wb = XLSX.read(exportRes.buffer, { type: 'buffer' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws);
    const lihua = rows.find((r) => r['姓名'] === '李华');
    if (lihua) {
      console.log('\n[验证登录] 李华的密码:', lihua['密码']);
      const studentLogin = await test('李华登录', studentLoginHandler, {
        method: 'POST',
        body: { name: '李华', password: String(lihua['密码']) },
        headers: {},
      });
      if (studentLogin.body?.token) {
        console.log('  ✅ 导入的学生能用密码正常登录');
      }
    }
  }

  console.log('\n========== 测试结束 ==========');
}

main().catch((err) => {
  console.error('测试脚本出错:', err);
  process.exit(1);
});
