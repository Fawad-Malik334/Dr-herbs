import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Package, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/admin/AdminLayout';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { toast } from 'sonner';
import { listProducts, listAdminOrders } from '@/api/api';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const [allOrders, allProducts] = await Promise.all([
          listAdminOrders(),
          listProducts(),
        ]);
        setOrders(Array.isArray(allOrders) ? allOrders : []);
        setProducts(Array.isArray(allProducts) ? allProducts : []);
      } catch (err) {
        toast.error(err?.message || 'Failed to load dashboard data');
        setOrders([]);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  // Calculate stats
  const totalRevenue = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
  const totalOrders = orders?.length || 0;
  const totalProducts = products?.length || 0;
  const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;

  // Recent orders
  const recentOrders = (orders || [])
    .slice()
    .sort((a, b) => new Date(b?.created_date || 0) - new Date(a?.created_date || 0))
    .slice(0, 5);

  const salesData = (() => {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const base = labels.map((name) => ({ name, sales: 0 }));

    (orders || []).forEach((o) => {
      if (!o?.created_date) return;
      const d = new Date(o.created_date);
      if (Number.isNaN(d.getTime())) return;
      const idx = (d.getDay() + 6) % 7; // 0=Mon
      base[idx].sales += Number(o.total || 0);
    });

    return base;
  })();

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      change: '',
      isPositive: true,
      color: 'bg-emerald-500',
    },

    {
      title: 'Total Orders',
      value: totalOrders,
      icon: ShoppingCart,
      change: '',
      isPositive: true,
      color: 'bg-blue-500',
    },

    {
      title: 'Products',
      value: totalProducts,
      icon: Package,
      change: '',
      isPositive: true,
      color: 'bg-purple-500',
    },

    {
      title: 'Pending Orders',
      value: pendingOrders,
      icon: TrendingUp,
      change: pendingOrders > 0 ? 'Action needed' : 'All clear',
      isPositive: pendingOrders === 0,
      color: 'bg-orange-500',
    },
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <AdminLayout title="Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 ${stat.color} rounded-full opacity-10 -translate-y-1/2 translate-x-1/2`} />
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  {stat.change ? (
                    <>
                      {stat.isPositive ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-sm ml-1 ${stat.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                        {stat.change}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-500">
                      {isLoading ? 'Loading...' : 'Updated'}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Weekly Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Order ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-500">
                        No orders yet
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">#{order.id?.slice(-6)}</td>
                        <td className="py-3 px-4">{order.customer_name}</td>
                        <td className="py-3 px-4 text-gray-500">
                          {order.created_date ? format(new Date(order.created_date), 'MMM d, yyyy') : '-'}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={statusColors[order.status] || statusColors.pending}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right font-semibold">
                          ${order.total?.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AdminLayout>
  );
}