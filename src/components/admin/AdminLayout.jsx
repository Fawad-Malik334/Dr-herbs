import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('drherbs_admin');
    if (!isAdmin) {
      navigate(createPageUrl('AdminLogin'));
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm h-16 flex items-center px-4 lg:px-8 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden mr-4"
          >
            <Menu className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}