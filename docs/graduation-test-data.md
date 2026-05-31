# 毕业留言板块 — 测试数据说明

## 前提

确保 `.env.local` 已配置完整，且 Supabase 表已创建。

## 方式一：使用脚本自动创建（推荐）

```bash
cd "tony-homepage"
node scripts/create-graduation-test-student.mjs
```

脚本会：
1. 读取 `.env.local`；
2. 随机生成四位数密码；
3. 生成 bcrypt hash 和 AES 加密字段；
4. 插入一条测试学生数据到 Supabase；
5. 在终端输出**明文密码**和登录地址（请复制保存）。

## 方式二：手动在 Supabase 中插入

1. 打开 Supabase Dashboard → Table Editor → `graduation_students`
2. 点击 **Insert row**
3. 填写字段：

| 字段 | 示例值 | 说明 |
|------|--------|------|
| `name` | 张三 | 学生姓名 |
| `class_name` | 初三(1)班 | 班级 |
| `teacher_message` | 祝你中考顺利！ | 老师留言 |
| `expected_score` | 85+ | 期望分数 |
| `teacher_name` | 王老师 | 老师署名 |
| `password_hash` | （见下方生成方法） | bcrypt hash |
| `password_encrypted` | （见下方生成方法） | AES 加密后的密码 |
| `password_iv` | （见下方生成方法） | AES IV |
| `password_auth_tag` | （见下方生成方法） | AES authTag |

### 手动生成密码字段

在终端执行：

```bash
# 1. 生成四位数密码
node -e "console.log(String(Math.floor(1000 + Math.random() * 9000)))"
# 输出示例：4827

# 2. 生成 bcrypt hash（把 4827 替换为实际密码）
node -e "console.log(require('bcryptjs').hashSync('4827', 10))"

# 3. 生成 AES 加密字段（把 4827 替换为实际密码，KEY 替换为 .env.local 中的 PASSWORD_ENCRYPTION_KEY）
node -e "
const crypto = require('crypto');
const key = Buffer.from('YOUR_BASE64_KEY_HERE', 'base64');
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
let enc = cipher.update('4827', 'utf8', 'base64');
enc += cipher.final('base64');
console.log('encrypted:', enc);
console.log('iv:', iv.toString('base64'));
console.log('authTag:', cipher.getAuthTag().toString('base64'));
"
```

## 登录测试

拿到密码后，用 curl 测试登录：

```bash
curl -X POST http://localhost:5173/api/graduation/student/login \
  -H "Content-Type: application/json" \
  -d '{"name":"张三","password":"4827"}'
```

然后测试获取留言：

```bash
curl -X GET http://localhost:5173/api/graduation/student/message \
  -H "Authorization: Bearer <上一步返回的token>"
```
