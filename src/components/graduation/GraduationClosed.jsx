import { Link } from 'react-router-dom';

export default function GraduationClosed() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-12">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-tony-text/5 flex items-center justify-center">
          <svg className="w-8 h-8 text-tony-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" />
          </svg>
        </div>

        <h1 className="text-2xl font-medium text-tony-text mb-3">
          毕业留言板块已关闭
        </h1>
        <p className="text-sm text-tony-muted mb-8 leading-relaxed">
          2026 届毕业留言已圆满结束。<br />
          感谢每一位同学的参与，愿你们前程似锦。
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-tony-text/10 border border-tony-border text-tony-text text-sm hover:bg-tony-text/15 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回主站
        </Link>
      </div>
    </div>
  );
}
