import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import prisma from '@/server/db/prisma';
import Navigation from '@/ui/components/layout/Navigation';

interface ThankYouPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function ThankYouPage({ params }: ThankYouPageProps) {
  const { orderId } = await params;

  // Fetch order with items
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    redirect('/');
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-border">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                <p className="font-mono font-semibold">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3">Shipping Address</h2>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="font-medium">{order.customerName}</p>
                <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                <p className="text-sm mt-2">{order.addressLine}</p>
                <p className="text-sm">
                  {order.city}, {order.zipCode}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h2 className="text-lg font-bold mb-3">Order Items</h2>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.variant.product.title}</p>
                      <p className="text-sm text-muted-foreground">
                        SKU: {item.variant.sku} • Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ${(Number(item.price) / 100).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ${(Number(item.price) * item.quantity / 100).toFixed(2)} total
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Order Total</span>
                <span className="text-2xl font-bold text-primary">
                  ${(Number(order.total) / 100).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-muted/30 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-bold mb-3">What happens next?</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  You will receive an order confirmation email at{' '}
                  <strong>{order.customerEmail}</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Your order will be processed and shipped within 2-3 business days</span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>You will receive a tracking number once your order ships</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/"
              className="flex-1 text-center bg-primary text-primary-foreground py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Continue Shopping
            </a>
            <a
              href="/shop"
              className="flex-1 text-center border border-border py-3 px-6 rounded-lg font-semibold hover:bg-muted/50 transition-colors"
            >
              Browse All Products
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
