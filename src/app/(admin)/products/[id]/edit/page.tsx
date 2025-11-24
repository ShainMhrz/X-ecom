import { prisma } from '@/server/db/prisma';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import ImageUploadSection from './ImageUploadSection';

interface Props { params: Promise<{ id: string }> }

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ 
    where: { id },
    include: {
      category: true,
      variants: true,
      images: true
    }
  });
  
  if (!product) return notFound();
  
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });
  
  async function update(formData: FormData) {
    'use server';
    const title = String(formData.get('title'));
    const slug = String(formData.get('slug'));
    const description = String(formData.get('description') || '');
    const categoryId = String(formData.get('categoryId') || '');
    const basePrice = Math.round(parseFloat(String(formData.get('basePrice') || '0')) * 100);
    const isFeatured = formData.get('featured') === 'on';
    const active = formData.get('active') === 'on';
    
    await prisma.product.update({ 
      where: { id }, 
      data: { 
        title, 
        slug,
        description,
        categoryId: categoryId || null,
        basePrice,
        isFeatured,
        active
      } 
    });
    
    revalidatePath('/products');
    redirect('/products');
  }
  
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back Button */}
      <div>
        <a 
          href="/products" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </a>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Edit Product</h1>
        <p className="text-muted-foreground">Update product details and information</p>
      </div>

      <form action={update} className="space-y-6 bg-card border border-border rounded-xl p-6">
        {/* Product Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Product Title <span className="text-destructive">*</span>
              </label>
              <input 
                name="title" 
                defaultValue={product.title} 
                className="w-full border border-border rounded-lg p-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary" 
                required 
                placeholder="e.g., Handcrafted Heritage Vessel"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                URL Slug <span className="text-destructive">*</span>
              </label>
              <input 
                name="slug" 
                defaultValue={product.slug} 
                className="w-full border border-border rounded-lg p-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm" 
                required 
                placeholder="handcrafted-heritage-vessel"
              />
              <p className="text-xs text-muted-foreground">
                URL-friendly version (lowercase, hyphens only). Used in product page URLs.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Description</label>
            <textarea 
              name="description" 
              defaultValue={product.description || ''} 
              className="w-full border border-border rounded-lg p-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px]" 
              placeholder="Describe your product in detail..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Category</label>
              <select 
                name="categoryId" 
                defaultValue={product.categoryId || ''} 
                className="w-full border border-border rounded-lg p-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">No Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Base Price (USD)</label>
              <input 
                name="basePrice" 
                type="number" 
                step="0.01"
                defaultValue={(Number(product.basePrice) / 100).toFixed(2)} 
                className="w-full border border-border rounded-lg p-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary" 
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground">
                Starting price. Variant prices will override this.
              </p>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">Settings</h2>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
              <input type="checkbox" name="featured" defaultChecked={product.isFeatured} className="w-4 h-4" />
              <div>
                <span className="text-sm font-medium text-foreground">Featured Product</span>
                <p className="text-xs text-muted-foreground">Show this product in the featured section on homepage</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
              <input type="checkbox" name="active" defaultChecked={product.active} className="w-4 h-4" />
              <div>
                <span className="text-sm font-medium text-foreground">Active</span>
                <p className="text-xs text-muted-foreground">Product is visible to customers</p>
              </div>
            </label>
          </div>
        </div>

        {/* Product Images */}
        <ImageUploadSection 
          productId={product.id}
          productTitle={product.title}
          images={product.images}
        />

        {/* Variants Info */}
        {product.variants.length > 0 && (
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Product Variants</p>
                <p className="text-xs text-muted-foreground mt-1">
                  This product has {product.variants.length} variant(s). Manage them separately.
                </p>
              </div>
              <a 
                href={`/variants/${product.id}`}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Manage Variants
              </a>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <button 
            type="submit" 
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Save Changes
          </button>
          <a 
            href="/products"
            className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
