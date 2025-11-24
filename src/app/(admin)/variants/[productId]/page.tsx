import { prisma } from '@/server/db/prisma';
import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';

interface Props { params: Promise<{ productId: string }> }

export default async function ProductVariantsAdmin({ params }: Props) {
  const { productId } = await params;
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { variants: true }
  });
  if (!product) return notFound();

  async function createVariant(formData: FormData) {
    'use server';
    const sku = String(formData.get('sku'));
    const price = Number(formData.get('price'));
    const stock = Number(formData.get('stock') || 0);
    await prisma.productVariant.create({ data: { productId: product.id, sku, price, stock } });
    revalidatePath(`/variants/${product.id}`);
  }

  async function updateVariantStock(formData: FormData) {
    'use server';
    const variantId = String(formData.get('variantId'));
    const stock = Number(formData.get('stock'));
    await prisma.productVariant.update({ 
      where: { id: variantId }, 
      data: { stock } 
    });
    revalidatePath(`/variants/${product.id}`);
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
        <h1 className="text-3xl font-bold text-foreground">Product Variants</h1>
        <p className="text-muted-foreground">{product.title}</p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">About Variants</p>
            <p className="text-xs text-blue-800 dark:text-blue-200">
              Variants are different versions of your product (e.g., sizes, colors, materials). Each variant has its own SKU (Stock Keeping Unit), price, and inventory.
            </p>
          </div>
        </div>
      </div>

      {/* Existing Variants */}
      {product.variants.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Existing Variants ({product.variants.length})</h2>
          <div className="space-y-3">
            {product.variants.map(v => (
              <div key={v.id} className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{v.sku}</p>
                    <p className="text-sm text-muted-foreground">
                      Stock: <span className={v.stock === 0 ? 'text-destructive font-semibold' : v.stock < 5 ? 'text-orange-600 font-semibold' : 'text-green-600 font-semibold'}>{v.stock}</span> available
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">${(Number(v.price) / 100).toFixed(2)}</p>
                  </div>
                </div>
                <form action={updateVariantStock} className="flex items-end gap-2">
                  <input type="hidden" name="variantId" value={v.id} />
                  <div className="flex-1">
                    <label className="block text-xs text-muted-foreground mb-1">Update Stock</label>
                    <input 
                      name="stock" 
                      type="number" 
                      defaultValue={v.stock}
                      min="0"
                      className="w-full border border-border rounded-lg p-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm" 
                    />
                  </div>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Update
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Variant */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Add New Variant</h2>
        <form action={createVariant} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                SKU (Stock Keeping Unit) <span className="text-destructive">*</span>
              </label>
              <input 
                name="sku" 
                required 
                className="w-full border border-border rounded-lg p-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono" 
                placeholder="e.g., HV-RED-LG"
              />
              <p className="text-xs text-muted-foreground">
                Unique identifier for inventory tracking (e.g., PRODUCT-COLOR-SIZE)
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Price (in cents) <span className="text-destructive">*</span>
              </label>
              <input 
                name="price" 
                type="number" 
                required 
                className="w-full border border-border rounded-lg p-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary" 
                placeholder="e.g., 4999 for $49.99"
              />
              <p className="text-xs text-muted-foreground">
                Enter price in cents (100 cents = $1.00). Example: 2999 = $29.99
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Initial Stock <span className="text-destructive">*</span>
              </label>
              <input 
                name="stock" 
                type="number" 
                defaultValue="0"
                min="0"
                required 
                className="w-full border border-border rounded-lg p-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary" 
                placeholder="e.g., 50"
              />
              <p className="text-xs text-muted-foreground">
                How many units are available
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button 
              type="submit" 
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Add Variant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
