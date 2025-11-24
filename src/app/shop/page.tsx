import { prisma } from '@/server/db/prisma';
import ProductCard from '@/ui/components/product/product-card';
import Navigation from '@/ui/components/layout/Navigation';
import { StorageService } from '@/server/services/storage/storage.service';

export default async function AllProductsPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: {
      variants: true,
      images: true,
      category: {
        select: { name: true, slug: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-7xl">
        {/* Back Button */}
        <div className="mb-6">
          <a 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </a>
        </div>

        {/* Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">All Products</h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Browse our complete collection of {products.length} products
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <a
              href="/shop"
              className="px-4 py-2 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              All Products ({products.length})
            </a>
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="px-4 py-2 rounded-full bg-muted text-foreground font-medium text-sm hover:bg-muted/80 transition-colors"
              >
                {cat.name} ({cat._count.products})
              </a>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No products available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.map(p => {
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
