import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { useSessionStore } from '@/store/sessionStore';

export function App() {
  const location = useLocation();
  const bootstrap = useSessionStore((s) => s.bootstrap);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  // Once, on mount: exchanges the httpOnly refresh cookie (if any) for a session, so a page
  // reload doesn't show "Mi cuenta" for someone who's actually still logged in. AccountMenu
  // renders an inert placeholder while `status` is still 'checking', so there's no flash.
  useEffect(() => {
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
