import { Link } from 'react-router-dom';

interface ComingSoonProps {
  title: string;
}

const ComingSoon = ({ title }: ComingSoonProps) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-4">
    <div className="text-6xl">🚧</div>
    <h1 className="text-2xl font-extrabold text-foreground">{title}</h1>
    <p className="text-muted-foreground text-sm max-w-xs">
      Trang này đang được xây dựng. Vui lòng quay lại sau!
    </p>
    <Link
      to="/"
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-primary-hover transition-colors"
    >
      ← Về trang chủ
    </Link>
  </div>
);

export default ComingSoon;
