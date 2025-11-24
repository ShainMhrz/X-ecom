import { prisma } from '@/server/db/prisma';
import Link from 'next/link';

export default async function OrdersAdminPage() {
  const orders = await prisma.order.findMany({ 
    include: { 
      items: {
        include: {
          variant: {
            include: {
              product: {
                select: { title: true }
              }
            }
          }
        }
      },
      user: {
        select: { name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    shipped: orders.filter(o => o.status === 'SHIPPED').length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground mt-1">Manage customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Shipped</p>
          <p className="text-2xl font-bold text-blue-600">{stats.shipped}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Delivered</p>
          <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
        </div>
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <p className="text-muted-foreground">No orders yet</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-foreground">Order ID</th>
                  <th className="p-4 text-left text-sm font-semibold text-foreground">Customer</th>
                  <th className="p-4 text-left text-sm font-semibold text-foreground">Date</th>
                  <th className="p-4 text-left text-sm font-semibold text-foreground">Items</th>
                  <th className="p-4 text-left text-sm font-semibold text-foreground">Total</th>
                  <th className="p-4 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="p-4 text-right text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <code className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                        {o.id.slice(0, 8)}...
                      </code>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          {o.user?.name || 'Guest'}
                        </p>
                        <p className="text-xs text-muted-foreground">{o.user?.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-muted-foreground">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(o.createdAt).toLocaleTimeString()}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-foreground">{o.items.length}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-bold text-primary">
                        ${(o.total / 100).toFixed(2)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        o.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                        o.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                        o.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link 
                        href={`/orders/${o.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
                      >
                        Manage
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
