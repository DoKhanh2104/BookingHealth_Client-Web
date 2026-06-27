/**
 * AI Chat Widget — floating button, click navigates to /screening page.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SparklesIcon } from './icons';

const AIChatWidget: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      id="ai-chat-widget-open-btn"
      onClick={() => navigate('/screening')}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary-hover active:scale-95 transition-colors group"
      title="Tư vấn AI - Tìm bác sĩ & Phân tích triệu chứng"
    >
      <SparklesIcon className="w-6 h-6" />

      {/* Tooltip */}
      <span className="absolute right-16 bg-foreground text-background text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-medium shadow-md">
        Tư vấn AI
      </span>
    </button>
  );
};

export default AIChatWidget;
