import { prisma } from '@/server/db/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  async function create(formData: FormData) {
    'use server';
    const title = String(formData.get('title'));
    const slug = String(formData.get('slug'));
    const description = String(formData.get('description') || '');
    const categoryId = String(formData.get('categoryId') || '');
    const basePrice = Math.round(parseFloat(String(formData.get('basePrice') || '0')) * 100);
    const isFeatured = formData.get('featured') === 'on';
    
    await prisma.product.create({ 
      data: { 
        title, 
        slug, 
        description,
        categoryId: categoryId || null,
        basePrice,
        isFeatured,
        active: true
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
        <h1 className="text-3xl font-bold text-foreground">Create New Product</h1>
        <p className="text-muted-foreground">Add a new product to your store inventory</p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Quick Start Guide</p>
            <p className="text-xs text-blue-800 dark:text-blue-200">
              After creating the product, you can add variants (sizes, colors, etc.) and upload product images from the product management page.
            </p>
          </div>
        </div>
      </div>

      <form action={create} className="space-y-6 bg-card border border-border rounded-xl p-6">
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
                className="w-full border border-border rounded-lg p-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary" 
                required 
                placeholder="e.g., Handcrafted Heritage Vessel"
              />
              <p className="text-xs text-muted-foreground">
                The main product name that customers will see
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                URL Slug <span className="text-destructive">*</span>
              </label>
              <input 
                name="slug" 
                className="w-full border border-border rounded-lg p-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm" 
                required 
                placeholder="handcrafted-heritage-vessel"
              />
              <p className="text-xs text-muted-foreground">
                <strong>What is a slug?</strong> It's the URL-friendly version of your product name. Use lowercase letters, numbers, and hyphens only (no spaces or special characters). Example: "Cool T-Shirt" → "cool-t-shirt"
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Product Description</label>
            <textarea 
              name="description" 
              className="w-full border border-border rounded-lg p-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px]" 
              placeholder="Describe your product in detail... Include materials, dimensions, care instructions, etc."
            />
            <p className="text-xs text-muted-foreground">
              Help customers understand what makes your product special
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Category</label>
              <select 
                name="categoryId" 
                className="w-full border border-border rounded-lg p-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">No Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                Group similar products together
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Base Price (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <input 
                  name="basePrice" 
                  type="number" 
                  step="0.01"
                  defaultValue="0.00"
                  className="w-full border border-border rounded-lg p-3 pl-7 bg-background focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="0.00"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Starting price. Add variants later for different sizes/colors with their own prices
              </p>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">Display Settings</h2>
          
          <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
            <input type="checkbox" name="featured" className="w-4 h-4" />
            <div>
              <span className="text-sm font-medium text-foreground">Featured Product</span>
              <p className="text-xs text-muted-foreground">Highlight this product on your homepage</p>
            </div>
          </label>
        </div>

        {/* Next Steps Info */}
        <div className="bg-muted/50 rounded-lg p-4 border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-2">After Creating:</h3>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Add product variants (sizes, colors, materials) with SKUs and stock levels</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Upload product images to showcase your item</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Set inventory quantities for each variant</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <button 
            type="submit" 
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Create Product
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
