import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import '@/styles/globals.css';
import { useStore } from '@/store/useStore';
import { getCurrentUser, onAuthChange, isGuest } from '@/lib/auth';
import BackgroundVideo from '@/components/BackgroundVideo';

// Navbar is loaded dynamically and ONLY rendered after authentication
// (login or guest). Before that, pages show their own landing/auth UI.
const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });

export default function App({ Component, pageProps }) {
  const setUser = useStore((s) => s.setUser);
  const setGuest = useStore((s) => s.setGuest);
  const setAuthReady = useStore((s) => s.setAuthReady);
  const authReady = useStore((s) => s.authReady);
  const authed = useStore((s) => s.isAuthenticated());

  // Hydrate session on first load and subscribe to auth changes.
  useEffect(() => {
    let unsub;
    (async () => {
      const user = await getCurrentUser();
      setUser(user);
      if (!user && isGuest()) setGuest(true);
      setAuthReady(true);
    })();
    unsub = onAuthChange((user) => setUser(user));
    return () => unsub && unsub();
  }, [setUser, setGuest, setAuthReady]);

  return (
    <div className="min-h-screen">
      <BackgroundVideo />
      {/* Navbar gating: only after the user is authenticated or a guest */}
      {authReady && authed && <Navbar />}
      <Component {...pageProps} />
    </div>
  );
}
