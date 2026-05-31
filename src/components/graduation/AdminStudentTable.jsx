export default function AdminStudentTable({ students }) {
  if (students.length === 0) {
    return (
      <div className="glass-card rounded-xl p-10 text-center">
        <p className="text-tony-muted text-sm">没有找到符合条件的学生</p>
      </div>
    );
  }

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b border-tony-border">
            <th className="text-left text-xs text-tony-muted font-medium px-4 py-3">姓名</th>
            <th className="text-left text-xs text-tony-muted font-medium px-4 py-3">班级</th>
            <th className="text-left text-xs text-tony-muted font-medium px-4 py-3">期待值</th>
            <th className="text-left text-xs text-tony-muted font-medium px-4 py-3">老师</th>
            <th className="text-left text-xs text-tony-muted font-medium px-4 py-3">登录</th>
            <th className="text-left text-xs text-tony-muted font-medium px-4 py-3">首次登录</th>
            <th className="text-left text-xs text-tony-muted font-medium px-4 py-3">回复</th>
            <th className="text-left text-xs text-tony-muted font-medium px-4 py-3">收藏</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id} className="border-b border-tony-border/50 hover:bg-tony-text/[0.02] transition-colors">
              <td className="px-4 py-3 text-sm text-tony-text">{s.name}</td>
              <td className="px-4 py-3 text-sm text-tony-muted">{s.className}</td>
              <td className="px-4 py-3 text-sm text-[#c4a574]">{s.expectedScore || '—'}</td>
              <td className="px-4 py-3 text-sm text-tony-muted">{s.teacherName}</td>
              <td className="px-4 py-3">
                {s.hasLoggedIn ? (
                  <span className="inline-flex items-center gap-1 text-xs text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    已登录
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-tony-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-tony-muted/40" />
                    未登录
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-xs text-tony-muted">{formatDate(s.firstLoggedInAt)}</td>
              <td className="px-4 py-3">
                {s.hasReplied ? (
                  <span className="inline-flex items-center gap-1 text-xs text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    已回复
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-tony-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-tony-muted/40" />
                    未回复
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                {s.replyHidden ? (
                  <span className="text-xs text-[#c4a574]">已收藏</span>
                ) : (
                  <span className="text-xs text-tony-muted">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 移动端卡片视图 */}
      <div className="sm:hidden divide-y divide-tony-border/50">
        {students.map((s) => (
          <div key={s.id} className="px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-tony-text">{s.name}</span>
              <span className="text-xs text-tony-muted">{s.className}</span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <span className="text-[#c4a574]">期待值: {s.expectedScore || '—'}</span>
              <span className="text-tony-muted">老师: {s.teacherName}</span>
              <span className={s.hasLoggedIn ? 'text-green-400' : 'text-tony-muted'}>
                {s.hasLoggedIn ? '已登录' : '未登录'}
              </span>
              <span className={s.hasReplied ? 'text-green-400' : 'text-tony-muted'}>
                {s.hasReplied ? '已回复' : '未回复'}
              </span>
              {s.replyHidden && <span className="text-[#c4a574]">已收藏</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
