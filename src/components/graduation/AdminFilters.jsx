import { useState, useEffect } from 'react';

export default function AdminFilters({ onChange, classes }) {
  const [keyword, setKeyword] = useState('');
  const [className, setClassName] = useState('all');
  const [hasLoggedIn, setHasLoggedIn] = useState('all');
  const [hasReplied, setHasReplied] = useState('all');
  const [replyHidden, setReplyHidden] = useState('all');

  useEffect(() => {
    onChange({ keyword, className, hasLoggedIn, hasReplied, replyHidden });
  }, [keyword, className, hasLoggedIn, hasReplied, replyHidden]);

  const handleClear = () => {
    setKeyword('');
    setClassName('all');
    setHasLoggedIn('all');
    setHasReplied('all');
    setReplyHidden('all');
  };

  const selectClass = "px-3 py-2 rounded-lg bg-tony-darker border border-tony-border text-sm text-tony-text focus:outline-none focus:border-tony-border-hover";

  return (
    <div className="glass-card rounded-xl p-4 sm:p-5 mb-5">
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs text-tony-muted mb-1.5">姓名搜索</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="输入姓名"
            className="w-full px-3 py-2 rounded-lg bg-tony-darker border border-tony-border text-sm text-tony-text placeholder-tony-muted/50 focus:outline-none focus:border-tony-border-hover"
          />
        </div>

        <div>
          <label className="block text-xs text-tony-muted mb-1.5">班级</label>
          <select value={className} onChange={(e) => setClassName(e.target.value)} className={selectClass}>
            <option value="all">全部班级</option>
            {classes.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-tony-muted mb-1.5">登录状态</label>
          <select value={hasLoggedIn} onChange={(e) => setHasLoggedIn(e.target.value)} className={selectClass}>
            <option value="all">全部</option>
            <option value="true">已登录</option>
            <option value="false">未登录</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-tony-muted mb-1.5">回复状态</label>
          <select value={hasReplied} onChange={(e) => setHasReplied(e.target.value)} className={selectClass}>
            <option value="all">全部</option>
            <option value="true">已回复</option>
            <option value="false">未回复</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-tony-muted mb-1.5">收藏状态</label>
          <select value={replyHidden} onChange={(e) => setReplyHidden(e.target.value)} className={selectClass}>
            <option value="all">全部</option>
            <option value="true">已收藏</option>
            <option value="false">未收藏</option>
          </select>
        </div>

        <button
          onClick={handleClear}
          className="px-4 py-2 rounded-lg text-sm text-tony-muted border border-tony-border hover:text-tony-text hover:border-tony-border-hover transition-colors"
        >
          清除筛选
        </button>
      </div>
    </div>
  );
}
