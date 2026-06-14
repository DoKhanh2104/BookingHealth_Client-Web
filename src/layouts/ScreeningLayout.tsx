import { Outlet } from 'react-router-dom';
import Header from './Header';

const ScreeningLayout = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Header />
      <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default ScreeningLayout;
