import { Link } from 'react-router-dom';
import { ClockIcon, ArrowLeftIcon } from './icons';

interface ComingSoonProps {
  title: string;
}

const ComingSoon = ({ title }: ComingSoonProps) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-4">
    <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
      <ClockIcon className="w-8 h-8" />
    </div>
    <h1 className="text-2xl font-extrabold text-foreground">{title}</h1>
    <p className="text-muted-foreground text-sm max-w-xs">
      Trang này đang được xây dựng. Vui lòng quay lại sau!
    </p>
    <Link to="/" className="btn btn-primary btn-md">
      <ArrowLeftIcon className="w-4 h-4" />
      Về trang chủ
    </Link>
  </div>
);

export default ComingSoon;
