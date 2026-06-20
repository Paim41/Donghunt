import { supabase } from './supabaseClient';

// Data-access layer. All Supabase queries live here so components stay clean.

export async function getAnimeList({ search = '', genre = '', status = '' } = {}) {
  let query = supabase.from('anime').select('*').order('updated_at', { ascending: false });
  if (search) query = query.ilike('title', `%${search}%`);
  if (genre) query = query.contains('genres', [genre]);
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getRecentlyUpdated(limit = 8) {
  const { data, error } = await supabase
    .from('anime')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function getAnimeById(id) {
  const { data, error } = await supabase.from('anime').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function getEpisodes(animeId) {
  const { data, error } = await supabase
    .from('episodes')
    .select('*')
    .eq('anime_id', animeId)
    .order('episode_number', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getEpisode(animeId, episodeNumber) {
  const { data, error } = await supabase
    .from('episodes')
    .select('*')
    .eq('anime_id', animeId)
    .eq('episode_number', episodeNumber)
    .single();
  if (error) throw error;
  return data;
}

// --- Watch history (logged-in users) ---
export async function upsertWatchHistory(userId, payload) {
  const { error } = await supabase
    .from('watch_history')
    .upsert(
      { user_id: userId, updated_at: new Date().toISOString(), ...payload },
      { onConflict: 'user_id,anime_id' }
    );
  if (error) throw error;
}

export async function getWatchHistory(userId) {
  const { data, error } = await supabase
    .from('watch_history')
    .select('*, anime(*)')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getResume(userId, animeId) {
  const { data, error } = await supabase
    .from('watch_history')
    .select('*')
    .eq('user_id', userId)
    .eq('anime_id', animeId)
    .maybeSingle();
  if (error) throw error;
  return data;
}
