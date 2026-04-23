import React from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="bg-background text-on-surface font-body-md text-body-md antialiased overflow-x-hidden min-h-screen">
      <Sidebar />
      <div className="ml-64 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 p-6 max-w-[1280px] w-full mx-auto flex flex-col gap-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
