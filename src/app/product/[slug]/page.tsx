import { prisma } from '@/server/db/prisma';
import { notFound } from 'next/navigation';
import { StorageService } from '@/server/services/storage/storage.service';
import AddToCartButton from './AddToCartButton';
import Navigation from '@/ui/components/layout/Navigation';

interface Props { params: Promise<{ slug: string }> }

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { slug },
    include: {
      variants: { include: { optionValues: true } },
      images: true,
      category: true
    }
  });
  
  if (!product) return notFound();
  
  const basePrice = product.basePrice ? Number(product.basePrice) / 100 : null;
  const minVariantPrice = product.variants.length > 0 
    ? Math.min(...product.variants.map(v => Number(v.price))) / 100 
    : null;
  const displayPrice = minVariantPrice || basePrice || 0;

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Back Button */}
        <div className="mb-6">
          <a 
            href={product.category ? `/category/${product.category.slug}` : '/shop'} 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {product.category ? product.category.name : 'Shop'}
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {product.images.length > 0 ? (
              product.images.map(img => (
                <img 
                  key={img.id} 
                  src={StorageService.getFileUrl(img.storageKey)} 
                  alt={img.alt ?? product.title} 
                  className="w-full rounded-xl border border-border object-cover aspect-square" 
                />
              ))
            ) : (
              <div className="w-full aspect-square bg-muted rounded-xl flex items-center justify-center border border-border">
                <span className="text-muted-foreground">No image available</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Breadcrumb */}
            {product.category && (
              <div className="text-sm text-muted-foreground">
                <a href="/" className="hover:text-primary">Home</a>
                {' / '}
                <a href={`/category/${product.category.slug}`} className="hover:text-primary">
                  {product.category.name}
                </a>
              </div>
            )}

            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground">{product.title}</h1>
              {product.isFeatured && (
                <span className="inline-block px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-medium">
                  Featured Product
                </span>
              )}
            </div>

            <div className="text-3xl font-bold text-primary">
              ${displayPrice.toFixed(2)}
              {product.variants.length > 1 && <span className="text-lg text-muted-foreground"> starting</span>}
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.description || 'No description available.'}
            </p>

            {/* Variants */}
            <div className="space-y-4 border-t border-border pt-6">
              <h2 className="text-xl font-semibold text-foreground">Available Variants</h2>
              {product.variants.length === 0 ? (
                <p className="text-muted-foreground">No variants available for this product.</p>
              ) : (
                <div className="space-y-3">
                  {product.variants.map(v => (
                    <div 
                      key={v.id} 
                      className="flex items-center justify-between border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{v.sku}</p>
                        <p className="text-sm text-muted-foreground">
                          Stock: {v.stock > 0 ? (
                            <span className={v.stock < 5 ? 'text-destructive' : 'text-green-600'}>
                              {v.stock} available
                            </span>
                          ) : (
                            <span className="text-destructive">Out of stock</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xl font-bold text-primary">
                          ${(Number(v.price) / 100).toFixed(2)}
                        </span>
                        <AddToCartButton 
                          variant={v}
                          productId={product.id}
                          productTitle={product.title}
                          disabled={v.stock === 0}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
