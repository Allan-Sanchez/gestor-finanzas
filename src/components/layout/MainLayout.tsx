import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for desktop */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Content area */}
        <div className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </div>

        {/* Mobile navigation */}
        <MobileNav />
      </main>
    </div>
  );
}
