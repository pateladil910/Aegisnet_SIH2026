import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

interface AppShellProps {
  connected: boolean;
  onRefresh?: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({ connected, onRefresh }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      <Navbar connected={connected} onSimulationTriggered={onRefresh} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};
