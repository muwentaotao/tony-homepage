export default function GraduationReadonlyNotice() {
  return (
    <div className="mt-6 text-center">
      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
        style={{
          background: 'rgba(196,165,116,0.08)',
          border: '1px solid rgba(196,165,116,0.15)',
          color: '#c4a574',
        }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        板块当前为只读纪念模式，可以查看留言但不能提交回信
      </div>
    </div>
  );
}
