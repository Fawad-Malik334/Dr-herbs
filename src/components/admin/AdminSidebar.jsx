import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Target,
  LogOut, 
  Leaf,
  ChevronRight
} from 'lucide-react';

import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: 'AdminDashboard' },
  { name: 'Products', icon: Package, path: 'AdminProducts' },
  { name: 'Orders', icon: ShoppingCart, path: 'AdminOrders' },
  { name: 'Facebook Pixel', icon: Target, path: 'AdminFacebookPixel' },
];

export default function AdminSidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('drherbs_admin');
    window.location.href = createPageUrl('AdminLogin');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 bg-emerald-950 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Dr. Herbs</h1>
              <p className="text-emerald-400 text-xs">Admin Panel</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname.includes(item.path.toLowerCase());
              return (
                <Link key={item.name} to={createPageUrl(item.path)}>
                  <div
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:translate-x-1
                      ${isActive 
                        ? 'bg-emerald-500 text-white' 
                        : 'text-emerald-300 hover:bg-emerald-900 hover:text-white'
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* View Store Button */}
          <Link to={createPageUrl('Home')} target="_blank" className="mb-4">
            <Button variant="outline" className="w-full border-emerald-700 text-emerald-300 hover:bg-emerald-900">
              View Store →
            </Button>
          </Link>

          {/* Logout */}
          <Button 
            onClick={handleLogout}
            variant="ghost" 
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}