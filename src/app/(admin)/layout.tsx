import LogoutButton from './LogoutButton';
import { cookies } from 'next/headers';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get('userEmail')?.value;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-card border-b lg:border-b-0 lg:border-r border-border">
        <div className="p-4 lg:p-6 border-b border-border">
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Heritage Store</p>
            </div>
          </a>
        </div>

        <nav className="p-2 lg:p-4 space-y-1 lg:space-y-2">
          <a 
            href="/dashboard" 
            className="flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors group text-sm lg:text-base"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="font-medium">Dashboard</span>
          </a>

          <a 
            href="/products" 
            className="flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors group text-sm lg:text-base"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="font-medium">Products</span>
          </a>

          <a 
            href="/orders" 
            className="flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors group text-sm lg:text-base"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="font-medium">Orders</span>
          </a>

          <a 
            href="/themes" 
            className="flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors group text-sm lg:text-base"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            <span className="font-medium">Themes</span>
          </a>

          <div className="pt-2 lg:pt-4 border-t border-border">
            <a 
              href="/" 
              className="flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg hover:bg-muted transition-colors group text-muted-foreground text-sm lg:text-base"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-medium">View Store</span>
            </a>
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="lg:absolute bottom-0 left-0 right-0 lg:w-64 p-4 border-t border-border bg-card">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Logged in as</p>
              <p className="text-sm font-medium text-foreground truncate">{userEmail || 'Admin'}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
