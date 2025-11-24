import { prisma } from '@/server/db/prisma';
import ProductCard from '@/ui/components/product/product-card';
import { StorageService } from '@/server/services/storage/storage.service';

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() || '';

  let products = [];
  
  if (query.length > 0) {
    products = await prisma.product.findMany({
      where: {
        active: true,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { category: { name: { contains: query, mode: 'insensitive' } } },
        ],
      },
      include: {
        variants: true,
        images: true,
        category: true,
      },
      orderBy: { title: 'asc' },
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Back Button */}
        <div>
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
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {query ? `Search Results for "${query}"` : 'Search Products'}
          </h1>
          {query && (
            <p className="text-muted-foreground">
              Found {products.length} {products.length === 1 ? 'product' : 'products'}
            </p>
          )}
        </div>

        {/* Search Form */}
        <form action="/search" method="GET" className="max-w-2xl">
          <div className="flex gap-2">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by product name, description, or category..."
              className="flex-1 px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Results */}
        {query.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto mb-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-foreground mb-2">Start Searching</h3>
            <p className="text-muted-foreground">Enter keywords to find products</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => {
              const firstImage = product.images.length > 0 ? product.images[0] : null;
              const imageUrl = firstImage ? StorageService.getFileUrl(firstImage.storageKey) : null;
              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  slug={product.slug}
                  title={product.title}
                  basePrice={Number(product.basePrice)}
                  variants={product.variants.map(v => ({ ...v, price: Number(v.price) }))}
                  imageUrl={imageUrl}
                  imageAlt={firstImage?.alt}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto mb-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Products Found</h3>
            <p className="text-muted-foreground mb-4">
              We couldn't find any products matching "{query}"
            </p>
            <a 
              href="/shop"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Browse All Products
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
