import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, Package, Truck, CheckCircle, XCircle, Clock, ImageIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import { format } from 'date-fns';
import { listAdminOrders, updateAdminOrder } from '@/api/api';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const allOrders = await listAdminOrders();
      setOrders(Array.isArray(allOrders) ? allOrders : []);
    } catch (err) {
      toast.error(err?.message || 'Failed to load orders');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateAdminOrder(orderId, { status: newStatus });
      await loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      toast.success('Order status updated!');
    } catch (err) {
      toast.error(err?.message || 'Failed to update order');
    }
  };

  const filteredOrders = orders?.filter((order) => {
    const matchesSearch =
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <AdminLayout title="Orders">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.entries(statusConfig).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="p-16 text-center">
            <p className="text-gray-500 text-lg">No orders found</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-4 px-6 font-medium text-gray-500">Order ID</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-500">Customer</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-500">Date</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-500">Items</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-500">Total</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-500">Status</th>
                  <th className="text-right py-4 px-6 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredOrders.map((order) => {
                    const config = statusConfig[order.status] || statusConfig.pending;
                    return (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-6 font-mono text-sm">
                          #{order.id?.slice(-8)}
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium text-gray-900">{order.customer_name}</p>
                            <p className="text-sm text-gray-500">{order.customer_phone}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-500">
                          {order.created_date
                            ? format(new Date(order.created_date), 'MMM d, yyyy HH:mm')
                            : '-'}
                        </td>
                        <td className="py-4 px-6">
                          {order.items?.length || 0} items
                        </td>
                        <td className="py-4 px-6 font-semibold text-gray-900">
                          ${order.total?.toFixed(2)}
                        </td>
                        <td className="py-4 px-6">
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleUpdateStatus(order.id, value)}
                          >
                            <SelectTrigger className={`w-32 h-8 text-xs ${config.color}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(statusConfig).map(([key, cfg]) => (
                                <SelectItem key={key} value={key}>
                                  <span className="flex items-center gap-2">
                                    <cfg.icon className="w-3 h-3" />
                                    {cfg.label}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-mono font-medium">#{selectedOrder.id?.slice(-8)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {selectedOrder.created_date
                      ? format(new Date(selectedOrder.created_date), 'PPpp')
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge className={statusConfig[selectedOrder.status]?.color}>
                    {statusConfig[selectedOrder.status]?.label}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment</p>
                  <p className="font-medium">Cash on Delivery</p>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-3">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Name:</span> {selectedOrder.customer_name}</p>
                  <p><span className="text-gray-500">Phone:</span> {selectedOrder.customer_phone}</p>
                  {selectedOrder.customer_email && (
                    <p><span className="text-gray-500">Email:</span> {selectedOrder.customer_email}</p>
                  )}
                  <p>
                    <span className="text-gray-500">Address:</span> {selectedOrder.shipping_address}
                    {selectedOrder.city && `, ${selectedOrder.city}`}
                    {selectedOrder.postal_code && ` ${selectedOrder.postal_code}`}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity} × ${item.price?.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ${(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>${selectedOrder.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span>
                    {selectedOrder.shipping_cost === 0
                      ? 'Free'
                      : `$${selectedOrder.shipping_cost?.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-emerald-600">${selectedOrder.total?.toFixed(2)}</span>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h3 className="font-semibold mb-2">Order Notes</h3>
                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}

              {/* Update Status */}
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-3">Update Status</h3>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <Button
                      key={key}
                      variant={selectedOrder.status === key ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedOrder.id, key)}
                      className={selectedOrder.status === key ? 'bg-emerald-500' : ''}
                    >
                      <config.icon className="w-4 h-4 mr-1" />
                      {config.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}