/**
 * AI Chat Widget — floating button, click navigates to /screening page.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AIChatWidget: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      id="ai-chat-widget-open-btn"
      onClick={() => navigate('/screening')}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group"
      title="Tư vấn AI - Tìm bác sĩ & Phân tích triệu chứng"
    >
      {/* Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z"
        />
      </svg>

      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />

      {/* Tooltip */}
      <span className="absolute right-16 bg-foreground text-background text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-medium shadow-lg">
        Tư vấn AI
      </span>
    </button>
  );
};

export default AIChatWidget;
