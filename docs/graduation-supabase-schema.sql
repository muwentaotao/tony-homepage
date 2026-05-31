-- ============================================================
-- 2026 届毕业留言板块 — Supabase 数据库结构
-- 在 Supabase SQL Editor 中执行以下全部语句
-- ============================================================

-- 学生表
CREATE TABLE IF NOT EXISTS graduation_students (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 TEXT NOT NULL,
  class_name           TEXT NOT NULL,
  teacher_message      TEXT NOT NULL,
  expected_score       TEXT,
  teacher_name         TEXT NOT NULL,
  teacher_message_at   TIMESTAMPTZ DEFAULT NOW(),

  -- 登录密码：bcrypt hash（用于校验）
  password_hash        TEXT NOT NULL,

  -- 可导出密码：AES-256-GCM 加密后的四位数密码
  password_encrypted   TEXT NOT NULL,
  password_iv          TEXT NOT NULL,
  password_auth_tag    TEXT NOT NULL,

  -- 登录状态
  has_logged_in        BOOLEAN DEFAULT FALSE,
  first_logged_in_at   TIMESTAMPTZ,
  last_logged_in_at    TIMESTAMPTZ,

  -- 回复控制
  reply_hidden         BOOLEAN DEFAULT FALSE,

  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW(),

  -- 第一版不允许同名学生
  CONSTRAINT uq_graduation_students_name UNIQUE (name)
);

-- 学生回信表
CREATE TABLE IF NOT EXISTS graduation_replies (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   UUID NOT NULL REFERENCES graduation_students(id) ON DELETE CASCADE,
  content      TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW(),

  -- 每个学生只能回复一次
  CONSTRAINT uq_graduation_replies_student_id UNIQUE (student_id),

  -- 内容长度 1–1000 字符
  CONSTRAINT chk_graduation_replies_content_length CHECK (char_length(content) BETWEEN 1 AND 1000)
);

-- 板块设置表（单行配置）
CREATE TABLE IF NOT EXISTS graduation_settings (
  id         INTEGER PRIMARY KEY DEFAULT 1,
  status     TEXT NOT NULL DEFAULT 'closed',
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT chk_graduation_settings_status CHECK (status IN ('open', 'readonly', 'closed'))
);

-- 初始化默认设置（closed，上线后由后台切换）
INSERT INTO graduation_settings (id, status)
VALUES (1, 'open')
ON CONFLICT (id) DO NOTHING;

-- 可选：为常用查询添加索引
CREATE INDEX IF NOT EXISTS idx_graduation_students_name ON graduation_students(name);
CREATE INDEX IF NOT EXISTS idx_graduation_replies_student_id ON graduation_replies(student_id);

-- 启用 Row Level Security（推荐，即使目前主要用 Service Role Key 访问）
ALTER TABLE graduation_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE graduation_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE graduation_settings ENABLE ROW LEVEL SECURITY;

-- 注意：当前阶段使用 Service Role Key 在服务端 API 中直接操作数据库，
-- RLS 策略可在后续根据安全需求补充。
