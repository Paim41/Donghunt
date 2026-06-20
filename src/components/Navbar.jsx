import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { signOut } from '@/lib/auth';

// Floating glassmorphism navbar. Rendered ONLY after auth (see _app gating).
const LINKS = [
  { href: '/browse', label: 'Browse' },
  { href: '/?section=continue', label: 'Continue' },
  { href: '/?section=bookmarks', label: 'Favorites' },
];

export default function Navbar() {
  const router = useRouter();
  const user = useStore((s) => s.user);
  const reset = useStore((s) => s.reset);

  const handleLogout = async () => {
    await signOut();
    reset();
    router.push('/');
  };

  // Figure out which nav link matches the current page so we can
  // highlight it. Links that point at "/" use a ?section= query to
  // distinguish Home/Continue/Favorites, so we compare both the
  // pathname and that query param.
  const isLinkActive = (href) => {
    const [hrefPath, hrefQuery] = href.split('?');
    if (router.pathname !== hrefPath) return false;
    if (!hrefQuery) return true;
    const params = new URLSearchParams(hrefQuery);
    return params.get('section') === (router.query.section || null);
  };

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-x-0 top-4 z-50 mx-auto flex w-[92%] max-w-5xl items-center justify-between rounded-2xl glass px-5 py-3 shadow-glow"
    >
      <Link href="/browse" className="font-heading text-xl font-extrabold tracking-wide text-white">
        DONG<span className="text-primary">HUNT</span>
      </Link>
      <div className="flex items-center gap-1 sm:gap-3">
        {LINKS.map((l) => {
          const active = isLinkActive(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active ? 'page' : undefined}
              className={`relative rounded-lg px-3 py-1.5 text-sm transition ${
                active ? 'text-white' : 'text-gray-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="nav-active-indicator"
                  className="absolute inset-0 rounded-lg bg-primary/25 ring-1 ring-primary/60"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{l.label}</span>
              {active && (
                <motion.span
                  layoutId="nav-active-dot"
                  className="absolute -bottom-1.5 left-1/2 z-10 h-1 w-1 -translate-x-1/2 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="rounded-lg bg-primary/90 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-primary"
        >
          {user ? 'Logout' : 'Exit Guest'}
        </button>
      </div>
    </motion.nav>
  );
}
