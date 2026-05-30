import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AIChatWidget from '../components/AIChatWidget';

const ClientLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {/* AI Chatbot Widget — floating, dùng RAG query live DB */}
      <AIChatWidget />
    </div>
  );
};

export default ClientLayout;
