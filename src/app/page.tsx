import { prisma } from '@/server/db/prisma';
import ProductCard from '@/ui/components/product/product-card';
import EarthenActivator from '@/ui/components/theme/EarthenActivator';
import Navigation from '@/ui/components/layout/Navigation';
import { StorageService } from '@/server/services/storage/storage.service';

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { isFeatured: true, active: true },
    include: { images: true, variants: true },
    orderBy: { createdAt: 'desc' }
  });

  const categories = await prisma.category.findMany({
    take: 4,
    include: { _count: { select: { products: true } } }
  });

  console.log('Products fetched:', products.length);
  console.log('Categories fetched:', categories.length);

  return (
    <div className="min-h-screen">
      <EarthenActivator />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--accent)_0%,transparent_50%)] opacity-[0.15]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--secondary)_0%,transparent_50%)] opacity-[0.1]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center space-y-8">
            <div className="inline-block">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4">
                <div className="h-px w-8 bg-primary/30" />
                <span className="uppercase tracking-wider">Est. 2024</span>
                <div className="h-px w-8 bg-primary/30" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-tight">
              Handcrafted<br />
              <span className="text-primary">Heritage</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
              Timeless vessels and artisan pieces forged from tradition.<br className="hidden sm:block" />
              Each item tells a story of craftsmanship passed through generations.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="/shop"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
              >
                <span>Explore Collection</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href="#categories"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border-2 border-border bg-background text-foreground font-medium hover:border-primary/50 hover:bg-muted transition-all"
              >
                Browse Categories
              </a>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Handcrafted Items', value: products.length + '+' },
              { label: 'Artisan Partners', value: '12+' },
              { label: 'Happy Customers', value: '500+' },
              { label: 'Years Heritage', value: '50+' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex items-end justify-between mb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider">
              <div className="h-px w-6 bg-primary" />
              <span>Curated</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Featured Collection</h2>
            <p className="text-muted-foreground">Handpicked pieces that define our heritage</p>
          </div>
          <a href="/shop" className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all">
            <span>View All</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-xl">
            <p className="text-muted-foreground">No featured products yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => {
              const firstImage = p.images[0];
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
      </section>

      {/* Categories Section */}
      <section id="categories" className="bg-muted/30 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-primary uppercase tracking-wider">
              <div className="h-px w-6 bg-primary" />
              <span>Shop By</span>
              <div className="h-px w-6 bg-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Explore Categories</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group relative overflow-hidden rounded-xl border border-border bg-background p-6 hover:shadow-lg hover:border-primary/50 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative space-y-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground">{cat._count.products} items</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="border-t border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🛡️', title: 'Authentic Craftsmanship', desc: 'Every piece is handcrafted by skilled artisans' },
              { icon: '🚚', title: 'Secure Shipping', desc: 'Safe delivery with tracking on all orders' },
              { icon: '♻️', title: 'Sustainable Materials', desc: 'Eco-friendly and ethically sourced materials' }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="text-3xl">{item.icon}</div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
