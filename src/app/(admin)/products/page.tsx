import { prisma } from '@/server/db/prisma';
import Link from 'next/link';
import DeleteProductButton from './DeleteProductButton';

export default async function AdminProducts() {
  const products = await prisma.product.findMany({ 
    include: { 
      variants: true,
      category: {
        select: { name: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your product inventory</p>
        </div>
        <Link 
          href="/products/new" 
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <p className="text-muted-foreground mb-4">No products yet. Create your first product!</p>
          <Link 
            href="/products/new"
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Create Product
          </Link>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-foreground">Product</th>
                  <th className="p-4 text-left text-sm font-semibold text-foreground">Category</th>
                  <th className="p-4 text-left text-sm font-semibold text-foreground">Variants</th>
                  <th className="p-4 text-left text-sm font-semibold text-foreground">Stock</th>
                  <th className="p-4 text-left text-sm font-semibold text-foreground">Price Range</th>
                  <th className="p-4 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="p-4 text-right text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => {
                  const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
                  const prices = p.variants.map(v => Number(v.price));
                  const minPrice = prices.length > 0 ? Math.min(...prices) / 100 : 0;
                  const maxPrice = prices.length > 0 ? Math.max(...prices) / 100 : 0;

                  return (
                    <tr key={p.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">{p.title}</p>
                          <p className="text-xs text-muted-foreground">{p.slug}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-muted-foreground">
                          {p.category?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-foreground">{p.variants.length}</span>
                      </td>
                      <td className="p-4">
                        <span className={`text-sm font-medium ${
                          totalStock === 0 ? 'text-destructive' :
                          totalStock < 10 ? 'text-orange-600' :
                          'text-green-600'
                        }`}>
                          {totalStock}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-foreground">
                          {minPrice === maxPrice 
                            ? `$${minPrice.toFixed(2)}`
                            : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`
                          }
                        </span>
                      </td>
                      <td className="p-4">
                        {p.isFeatured && (
                          <span className="inline-block px-2 py-1 bg-accent text-accent-foreground rounded-full text-xs font-medium">
                            Featured
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            href={`/product/${p.slug}`}
                            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            title="View"
                            target="_blank"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                          <Link 
                            href={`/products/${p.id}/edit`}
                            className="p-2 rounded-lg hover:bg-primary/10 transition-colors text-primary"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <Link 
                            href={`/variants/${p.id}`}
                            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            title="Manage Variants"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                          </Link>
                          <DeleteProductButton productId={p.id} productTitle={p.title} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
