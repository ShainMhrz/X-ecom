import { prisma } from '@/server/db/prisma';
import { notFound } from 'next/navigation';
import ProductCard from '@/ui/components/product/product-card';
import Navigation from '@/ui/components/layout/Navigation';
import { StorageService } from '@/server/services/storage/storage.service';

interface Props { params: Promise<{ slug: string }> }

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await prisma.category.findFirst({
    where: { slug },
    include: { 
      products: {
        include: {
          variants: true,
          images: true
        }
      }
    }
  });
  
  if (!category) return notFound();
  
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Back Button */}
        <div className="mb-6">
          <a 
            href="/shop" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Shop
          </a>
        </div>

        {/* Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{category.name}</h1>
          {category.description && (
            <p className="text-base md:text-lg text-muted-foreground">{category.description}</p>
          )}
          <p className="text-sm text-muted-foreground">
            {category.products.length} {category.products.length === 1 ? 'product' : 'products'} available
          </p>
        </div>

        {/* Products Grid */}
        {category.products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No products found in this category yet.</p>
            <a 
              href="/shop"
              className="inline-block mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Browse All Products
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {category.products.map(p => {
              const firstImage = p.images.length > 0 ? p.images[0] : null;
              const imageUrl = firstImage ? StorageService.getFileUrl(firstImage.storageKey) : null;
              return (
                <ProductCard 
                  key={p.id}
                  id={p.id}
                  slug={p.slug}
                  title={p.title}
                  basePrice={Number(p.basePrice)}
                  variants={p.variants.map(v => ({ ...v, price: Number(v.price) }))}
                  imageUrl={imageUrl}
                  imageAlt={firstImage?.alt}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
