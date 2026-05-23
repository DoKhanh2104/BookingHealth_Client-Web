import React from "react";
import { useNavigate } from "react-router-dom";

const HomeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
    />
  </svg>
);

const PageNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 text-center">
      <div className="flex flex-col items-center max-w-md w-full space-y-6">
        <div className="relative flex items-center justify-center mb-2">
          {/* Subtle glowing effect in the background */}
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary to-secondary opacity-20 blur-2xl select-none pointer-events-none" />
          
          <h1 className="relative text-[120px] md:text-[200px] font-black leading-none bg-gradient-to-br from-primary to-primary-hover bg-clip-text text-transparent opacity-15 select-none tracking-tighter">
            404
          </h1>
        </div>

        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
          Oops! Trang không tồn tại
        </h2>

        <p className="text-muted-foreground max-w-[480px] text-base md:text-lg leading-relaxed">
          Có vẻ như bạn đã đi lạc hoặc đường dẫn này đã bị thay đổi. Đừng lo lắng, hãy quay lại trang chủ để tiếp tục công việc nhé.
        </p>

        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-10 py-3.5 text-base font-bold text-primary-foreground shadow-[0_8px_25px_rgba(26,113,180,0.4)] transition-all duration-300 ease-in-out hover:-translate-y-[3px] hover:shadow-[0_12px_30px_rgba(26,113,180,0.6)] hover:bg-primary-hover active:translate-y-0 active:scale-[0.98] cursor-pointer"
        >
          <HomeIcon className="w-5 h-5" />
          <span>Quay lại trang chủ</span>
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
