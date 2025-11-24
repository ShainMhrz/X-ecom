"use client";
import { useCartStore } from '@/lib/state/cartStore';
import Navigation from '@/ui/components/layout/Navigation';

export default function CartPage() {
  const { items, total, removeItem, updateQuantity, clear } = useCartStore();
  
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Shopping Cart</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-16 border border-border rounded-xl bg-muted/30">
            <div className="space-y-4">
              <svg className="mx-auto w-24 h-24 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-xl text-muted-foreground">Your cart is empty</p>
              <a 
                href="/" 
                className="inline-block mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Continue Shopping
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div 
                  key={item.variantId} 
                  className="flex items-center gap-4 border border-border rounded-xl p-4 bg-card"
                >
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                    <p className="text-lg font-bold text-primary">
                      ${(Number(item.price) / 100).toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.variantId, Math.max(1, item.quantity - 1))}
                        className="px-3 py-2 hover:bg-muted transition-colors"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        className="w-16 text-center border-x border-border bg-background py-2 focus:outline-none"
                        value={item.quantity}
                        min={1}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          updateQuantity(item.variantId, Math.max(1, val));
                        }}
                      />
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="px-3 py-2 hover:bg-muted transition-colors"
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.variantId)} 
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      title="Remove from cart"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border border-border rounded-xl p-6 bg-card sticky top-24 space-y-4">
                <h2 className="text-xl font-bold text-foreground">Order Summary</h2>
                
                <div className="space-y-2 py-4 border-y border-border">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                    <span>${(total() / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                </div>
                
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">${(total() / 100).toFixed(2)}</span>
                </div>
                
                <a 
                  href="/checkout"
                  className="block w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-center"
                >
                  Proceed to Checkout
                </a>
                
                <button 
                  onClick={clear} 
                  className="w-full bg-destructive/10 text-destructive py-2 rounded-lg font-medium hover:bg-destructive/20 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
