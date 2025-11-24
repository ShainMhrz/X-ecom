'use client';

import { useCartStore } from '@/lib/state/cartStore';
import { useState } from 'react';

interface AddToCartButtonProps {
  variant: {
    id: string;
    sku: string;
    price: number | string;
  };
  productId: string;
  productTitle: string;
  disabled?: boolean;
}

export default function AddToCartButton({ variant, productId, productTitle, disabled }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      variantId: variant.id,
      productId: productId,
      title: productTitle,
      sku: variant.sku,
      price: Number(variant.price),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled}
      className={`w-full sm:w-auto px-4 sm:px-6 py-3 rounded-lg font-medium transition-all text-sm sm:text-base active:scale-95 ${
        disabled
          ? 'bg-muted text-muted-foreground cursor-not-allowed'
          : added
          ? 'bg-green-600 text-white shadow-lg'
          : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg'
      }`}
    >
      {disabled ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Out of Stock
        </span>
      ) : added ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Added to Cart!
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Add to Cart
        </span>
      )}
    </button>
  );
}
