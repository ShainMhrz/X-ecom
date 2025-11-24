import { prisma } from '@/server/db/prisma';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

interface Props { params: Promise<{ id: string }> }

const transitions: Record<string, string[]> = {
  PENDING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: []
};

export default async function OrderManagePage({ params }: Props) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ 
    where: { id }, 
    include: { 
      items: { 
        include: { 
          variant: {
            include: {
              product: {
                select: { title: true, slug: true }
              }
            }
          }
        } 
      },
      user: {
        select: { name: true, email: true }
      }
    } 
  });
  
  if (!order) return notFound();

  async function updateStatus(formData: FormData) {
    'use server';
    const status = String(formData.get('status')) as any;
    await prisma.order.update({ where: { id: order.id }, data: { status } });
    revalidatePath(`/orders/${order.id}`);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link 
              href="/orders"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Order Details</h1>
          </div>
          <p className="text-sm text-muted-foreground font-mono">{order.id}</p>
        </div>
        <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${
          order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
          order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
          order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
          'bg-yellow-100 text-yellow-700'
        }`}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.items.map(i => (
                <div key={i.id} className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-foreground">{i.variant.product.title}</p>
                    <p className="text-sm text-muted-foreground">SKU: {i.variant.sku}</p>
                    <p className="text-sm text-muted-foreground">
                      ${(i.price / 100).toFixed(2)} × {i.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">
                      ${(i.price * i.quantity / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">
                  ${(order.total / 100).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Update Status */}
          {transitions[order.status].length > 0 && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Update Status</h2>
              <form action={updateStatus} className="space-y-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-foreground mb-2">
                    Change status to:
                  </label>
                  <select 
                    name="status" 
                    id="status"
                    className="w-full border border-border rounded-lg p-3 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {transitions[order.status].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Update Order Status
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Order Info Sidebar */}
        <div className="space-y-4">
          {/* Customer Info */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Customer</h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-sm font-medium text-foreground">
                  {order.user?.name || 'Guest'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground">
                  {order.user?.email || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Order Info</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Order Date</p>
                <p className="text-sm font-medium text-foreground">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="text-sm font-medium text-foreground">
                  {new Date(order.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Items Count</p>
                <p className="text-sm font-medium text-foreground">
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
