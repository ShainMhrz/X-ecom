import { prisma } from '@/server/db/prisma';

export default async function AdminDashboard() {
  // Fetch dashboard statistics
  const [productsCount, categoriesCount, ordersCount, totalRevenue] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { total: true },
    }),
  ]);

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { name: true, email: true }
      }
    }
  });

  const lowStockProducts = await prisma.productVariant.findMany({
    where: { stock: { lte: 5 } },
    take: 5,
    include: {
      product: {
        select: { title: true, slug: true }
      }
    },
    orderBy: { stock: 'asc' }
  });

  const stats = [
    {
      title: 'Total Products',
      value: productsCount,
      icon: '📦',
      href: '/products',
    },
    {
      title: 'Categories',
      value: categoriesCount,
      icon: '🏷️',
      href: '/products',
    },
    {
      title: 'Total Orders',
      value: ordersCount,
      icon: '🛒',
      href: '/orders',
    },
    {
      title: 'Total Revenue',
      value: `$${((totalRevenue._sum.total || 0) / 100).toFixed(2)}`,
      icon: '💰',
      href: '/orders',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">Welcome to your store admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <a
            key={stat.title}
            href={stat.href}
            className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {stat.value}
                </p>
              </div>
              <div className="text-4xl opacity-50 group-hover:opacity-100 transition-opacity">
                {stat.icon}
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Recent Orders</h2>
            <a href="/orders" className="text-sm text-primary hover:underline">
              View All →
            </a>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <a
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block p-3 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {order.user?.name || order.user?.email || 'Guest'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-bold text-primary">
                        ${(order.total / 100).toFixed(2)}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Products */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Low Stock Alert</h2>
            <a href="/products" className="text-sm text-primary hover:underline">
              Manage →
            </a>
          </div>
          {lowStockProducts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">All products well-stocked ✓</p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((variant) => (
                <a
                  key={variant.id}
                  href={`/products/${variant.productId}/edit`}
                  className="block p-3 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {variant.product.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        SKU: {variant.sku}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${
                        variant.stock === 0 ? 'text-destructive' : 
                        variant.stock <= 2 ? 'text-orange-600' : 
                        'text-yellow-600'
                      }`}>
                        {variant.stock === 0 ? 'Out of Stock' : `${variant.stock} left`}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
