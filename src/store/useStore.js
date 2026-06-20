import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { upsertWatchHistory } from '@/lib/api';

// Global app state: auth/session info, bookmarks, and watch progress.
// Guests are persisted to localStorage; logged-in users sync to Supabase.

export const useStore = create(
  persist(
    (set, get) => ({
      // --- session ---
      user: null, // Supabase user or null
      isGuest: false,
      authReady: false,
      setUser: (user) => set({ user, isGuest: user ? false : get().isGuest }),
      setGuest: (val) => set({ isGuest: val }),
      setAuthReady: (val) => set({ authReady: val }),
      // True once the user has either logged in or chosen guest mode.
      isAuthenticated: () => Boolean(get().user) || get().isGuest,

      // --- bookmarks (favorites) ---
      bookmarks: {}, // { [animeId]: true }
      toggleBookmark: (animeId) =>
        set((s) => {
          const next = { ...s.bookmarks };
          if (next[animeId]) delete next[animeId];
          else next[animeId] = true;
          return { bookmarks: next };
        }),
      isBookmarked: (animeId) => Boolean(get().bookmarks[animeId]),

      // --- watch progress ---
      // { [animeId]: { episode, time, completed } }
      progress: {},
      getProgress: (animeId) => get().progress[animeId] || null,
      // Called by the throttled saver in VideoPlayer.
      saveProgress: async (animeId, { episode, time, completed = false }) => {
        set((s) => ({
          progress: { ...s.progress, [animeId]: { episode, time, completed } },
        }));
        const { user } = get();
        if (user) {
          // Sync to Supabase for logged-in users.
          try {
            await upsertWatchHistory(user.id, {
              anime_id: animeId,
              last_watched_episode: episode,
              resume_timestamp: time,
              is_completed: completed,
            });
          } catch (e) {
            console.error('Failed to sync watch progress', e);
          }
        }
        // Guests: persisted automatically via the persist middleware.
      },

      reset: () => set({ user: null, isGuest: false, bookmarks: {}, progress: {} }),
    }),
    {
      name: 'donghunt-store',
      // Only persist client-relevant slices.
      partialize: (s) => ({ isGuest: s.isGuest, bookmarks: s.bookmarks, progress: s.progress }),
    }
  )
);
