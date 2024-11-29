import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import { DashboardHeader } from '@/components/layout/dashboard-header';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;