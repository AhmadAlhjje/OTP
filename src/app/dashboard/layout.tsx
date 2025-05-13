'use client';
import { useState } from 'react';
import Navbar from '../../components/organisms/Navbar';
import Sidebar from '../../components/organisms/Sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleNavbar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex flex-col h-screen">
      <Navbar onToggleNavbar={toggleNavbar} />
      <div className="flex flex-1 overflow-hidden">
        
        <main className="flex-1 overflow-auto p-4 bg-gray-100">
          {children}
        </main>
        <Sidebar isOpen={sidebarOpen} />
      </div>
    </div>
  );
}