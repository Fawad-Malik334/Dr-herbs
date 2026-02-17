import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getFacebookPixelReport } from '@/api/api';

export default function AdminFacebookPixel() {
  const [adCode, setAdCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState(null);

  const onSearch = async () => {
    const code = String(adCode || '').trim();
    if (!code) {
      toast.error('Please enter an Ad Code (e.g., FB_AD_01)');
      return;
    }

    setIsLoading(true);
    try {
      const data = await getFacebookPixelReport(code);
      setReport(data || null);
      if (!data?.orders?.length) {
        toast.message('No orders found for this ad code');
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to load report');
      setReport(null);
    } finally {
      setIsLoading(false);
    }
  };

  const orders = Array.isArray(report?.orders) ? report.orders : [];
  const totalOrders = Number(report?.total_orders || orders.length || 0);
  const totalRevenue = Number(report?.total_revenue || 0);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <AdminLayout title="Facebook Pixel">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search by Ad Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="FB_AD_01"
              value={adCode}
              onChange={(e) => setAdCode(e.target.value)}
            />
            <Button
              onClick={onSearch}
              disabled={isLoading}
              className="bg-emerald-500 hover:bg-emerald-600 gap-2"
            >
              <Search className="w-4 h-4" />
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {report && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalOrders}</div>
              <div className="text-sm text-gray-500 mt-1">Ad Code: {report.ad_code}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${totalRevenue.toFixed(2)}</div>
              <div className="text-sm text-gray-500 mt-1">From attributed orders</div>
            </CardContent>
          </Card>
        </div>
      )}

      {report && (
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center text-gray-500 py-10">No orders found for this ad code.</div>
            ) : (
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
                    {orders.map((o) => (
                      <tr key={o.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">#{String(o.id || '').slice(-6)}</td>
                        <td className="py-3 px-4">{o.customer_name || '-'}</td>
                        <td className="py-3 px-4 text-gray-500">
                          {o.created_date ? new Date(o.created_date).toLocaleDateString() : '-'}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={statusColors[o.status] || statusColors.pending}>{o.status || 'pending'}</Badge>
                        </td>
                        <td className="py-3 px-4 text-right font-semibold">${Number(o.total || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
}
