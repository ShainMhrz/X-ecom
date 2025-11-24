'use client';

import { useCartStore } from '@/lib/state/cartStore';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Variant {
  id: string;
  sku: string;
  price: any;
  stock: number;
}

interface Props {
  id: string;
  slug: string;
  title: string;
  basePrice: any;
  variants: Variant[];
  imageUrl: string | null;
  imageAlt?: string | null;
}

export default function ProductCard({ id, slug, title, basePrice, variants, imageUrl, imageAlt }: Props) {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();
  const variantPrices = variants?.map(v => Number(v.price)) ?? [];
  const minVariant = variantPrices.length ? Math.min(...variantPrices) : null;
  const display = minVariant ?? Number(basePrice) ?? 0;
  const imgSrc = imageUrl || 'https://placehold.co/600x600/d4a574/2c1810?text=Heritage+Vessel&font=raleway';
  
  const totalStock = variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
  const isLowStock = totalStock < 5 && totalStock > 0;
  const isOutOfStock = totalStock === 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (variants.length === 1) {
      const variant = variants[0];
      if (variant.stock > 0) {
        addItem({
          variantId: variant.id,
          productId: id,
          title: title,
          sku: variant.sku,
          price: Number(variant.price),
        });
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2000);
      }
    } else if (variants.length > 1) {
      setShowQuickAdd(!showQuickAdd);
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (variants.length === 1) {
      const variant = variants[0];
      if (variant.stock > 0) {
        addItem({
          variantId: variant.id,
          productId: id,
          title: title,
          sku: variant.sku,
          price: Number(variant.price),
        });
        router.push('/cart');
      }
    } else {
      router.push(`/product/${slug}`);
    }
  };

  const handleVariantSelect = (e: React.MouseEvent, variantId: string, action: 'add' | 'buy' = 'add') => {
    e.preventDefault();
    e.stopPropagation();
    
    const variant = variants.find(v => v.id === variantId);
    if (variant && variant.stock > 0) {
      addItem({
        variantId: variant.id,
        productId: id,
        title: title,
        sku: variant.sku,
        price: Number(variant.price),
      });
      
      if (action === 'buy') {
        router.push('/cart');
      } else {
        setJustAdded(true);
        setShowQuickAdd(false);
        setTimeout(() => setJustAdded(false), 2000);
      }
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (showQuickAdd) {
      e.preventDefault();
      return;
    }
    router.push(`/product/${slug}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative cursor-pointer"
    >
      <div className="relative flex flex-col rounded-xl overflow-hidden border border-border bg-background hover:shadow-xl hover:border-primary/50 transition-all duration-300">
        {/* Image Container */}
        <div className="relative aspect-square w-full bg-muted overflow-hidden">
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {isLowStock && !isOutOfStock && (
              <div className="px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-medium shadow-lg">
                Only {totalStock} left
              </div>
            )}
            {isOutOfStock && (
              <div className="px-3 py-1 rounded-full bg-destructive text-destructive-foreground text-xs font-medium shadow-lg">
                Out of Stock
              </div>
            )}
          </div>

          {/* Quick Add Button */}
          {!isOutOfStock && (
            <button
              onClick={handleQuickAdd}
              className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 shadow-lg ${
                justAdded 
                  ? 'bg-green-600 text-white scale-110' 
                  : 'bg-white text-foreground hover:bg-primary hover:text-primary-foreground opacity-0 group-hover:opacity-100'
              }`}
            >
              {justAdded ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
            </button>
          )}

          <img
            src={imgSrc}
            alt={imageAlt ?? title}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Quick View Link */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-foreground text-sm font-medium shadow-lg hover:bg-primary hover:text-primary-foreground transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Quick View
            </span>
          </div>
        </div>

        {/* Variant Quick Select Popup */}
        {showQuickAdd && variants.length > 1 && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-0 top-full mt-2 z-20 bg-background border border-border rounded-lg shadow-2xl p-4 space-y-2"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground">Select variant to add:</p>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowQuickAdd(false);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {variants.map((variant) => (
              <div key={variant.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{variant.sku}</span>
                  <span className="font-bold text-primary">
                    ${(Number(variant.price) / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => handleVariantSelect(e, variant.id, 'add')}
                    disabled={variant.stock === 0}
                    className="flex-1 py-1.5 px-3 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={(e) => handleVariantSelect(e, variant.id, 'buy')}
                    disabled={variant.stock === 0}
                    className="flex-1 py-1.5 px-3 text-xs font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Buy Now
                  </button>
                </div>
                {variant.stock === 0 && (
                  <span className="text-xs text-destructive">Out of Stock</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
              {title}
            </h3>
          </div>

          {/* Action Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center gap-1">
                {totalStock > 10 ? (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    <span>In Stock</span>
                  </div>
                ) : totalStock > 0 ? (
                  <div className="flex items-center gap-1 text-xs text-orange-600">
                    <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                    <span>{totalStock} left</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-destructive">
                    <div className="w-2 h-2 rounded-full bg-destructive"></div>
                    <span>Sold Out</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-primary">
                  ${(display / 100).toFixed(2)}
                </span>
                {variants && variants.length > 1 && (
                  <span className="text-xs text-muted-foreground">
                    {variants.length} options
                  </span>
                )}
              </div>
            </div>
            
            {!isOutOfStock && (
              <div className="flex gap-2">
                <button
                  onClick={handleQuickAdd}
                  className="flex-1 py-2 px-3 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-2 px-3 text-xs font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Buy Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
