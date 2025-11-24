'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '@/lib/state/cartStore';
import { placeOrder } from '@/actions/place-order';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/ui/components/layout/Navigation';

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Invalid email address'),
  addressLine: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  zipCode: z.string().min(4, 'Zip code must be at least 4 characters'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, total, clear } = useCartStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      addressLine: '',
      city: '',
      zipCode: '',
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const cartItems = items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      }));

      const result = await placeOrder(data, cartItems);

      if (result.success) {
        clear();
        router.push(`/thank-you/${result.orderId}`);
      } else {
        setError(result.error || 'Failed to place order');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Checkout error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background py-12">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add some products before checking out</p>
            <a
              href="/"
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-bold mb-6">Shipping Information</h2>

                {error && (
                  <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive font-medium">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="customerName" className="block text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      id="customerName"
                      type="text"
                      {...register('customerName')}
                      className="w-full border border-border rounded-lg px-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="John Doe"
                    />
                    {errors.customerName && (
                      <p className="text-sm text-destructive mt-1">{errors.customerName.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="customerEmail" className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      id="customerEmail"
                      type="email"
                      {...register('customerEmail')}
                      className="w-full border border-border rounded-lg px-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="john@example.com"
                    />
                    {errors.customerEmail && (
                      <p className="text-sm text-destructive mt-1">{errors.customerEmail.message}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="addressLine" className="block text-sm font-medium mb-2">
                      Street Address *
                    </label>
                    <input
                      id="addressLine"
                      type="text"
                      {...register('addressLine')}
                      className="w-full border border-border rounded-lg px-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="123 Main Street, Apt 4B"
                    />
                    {errors.addressLine && (
                      <p className="text-sm text-destructive mt-1">{errors.addressLine.message}</p>
                    )}
                  </div>

                  {/* City & Zip */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium mb-2">
                        City *
                      </label>
                      <input
                        id="city"
                        type="text"
                        {...register('city')}
                        className="w-full border border-border rounded-lg px-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="New York"
                      />
                      {errors.city && (
                        <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium mb-2">
                        Zip Code *
                      </label>
                      <input
                        id="zipCode"
                        type="text"
                        {...register('zipCode')}
                        className="w-full border border-border rounded-lg px-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="10001"
                      />
                      {errors.zipCode && (
                        <p className="text-sm text-destructive mt-1">{errors.zipCode.message}</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                  </button>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-xl p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-muted-foreground text-xs">
                          {item.sku} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">${((item.price * item.quantity) / 100).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 py-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${(total() / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-bold pt-4 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">${(total() / 100).toFixed(2)}</span>
                </div>

                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">Secure Checkout</p>
                      <p>Your information is protected with industry-standard encryption.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
