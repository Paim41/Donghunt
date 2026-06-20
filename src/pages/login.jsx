import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { signIn, signUp } from '@/lib/auth';
import { useStore } from '@/store/useStore';

// Email + password login / signup screen. No navbar here (pre-auth).
export default function LoginPage() {
  const router = useRouter();
  const setUser = useStore((s) => s.setUser);
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = mode === 'login' ? await signIn(email, password) : await signUp(email, password);
      setUser(user);
      router.push('/browse');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <motion.form
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl glass p-8 shadow-glow"
      >
        <h1 className="mb-6 text-center font-heading text-3xl text-white">
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h1>
        <label className="mb-1 block text-sm text-gray-300">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-lg bg-black/30 px-3 py-2 text-white outline-none ring-1 ring-white/10 focus:ring-primary"
        />
        <label className="mb-1 block text-sm text-gray-300">Password</label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-lg bg-black/30 px-3 py-2 text-white outline-none ring-1 ring-white/10 focus:ring-primary"
        />
        {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary px-4 py-2.5 font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Please wait' : mode === 'login' ? 'Login' : 'Sign up'}
        </button>
        <p className="mt-4 text-center text-sm text-gray-400">
          {mode === 'login' ? "No account?" : 'Have an account?'}{' '}
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-accent hover:underline"
          >
            {mode === 'login' ? 'Sign up' : 'Login'}
          </button>
        </p>
        <p className="mt-2 text-center text-xs text-gray-500">
          <Link href="/" className="hover:underline">Back to home</Link>
        </p>
      </motion.form>
    </main>
  );
}
