-- Realistic example catalog so the app shows real data from Supabase.
-- Run after 0001_init.sql. Uses sample open video sources for the player.

with a as (
  insert into public.anime (title, description, cover_image, genres, status, total_episodes)
  values
    ('Soul Land: Awakening',
     'A young swordsman awakens a rare spirit and rises through the academies to protect his fallen clan.',
     'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80',
     array['Action','Fantasy','Adventure'], 'ongoing', 2),
    ('Throne of Seal',
     'Demons returned and humanity fights back. One orphan carries the power to seal the abyss.',
     'https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=600&q=80',
     array['Action','Supernatural'], 'ongoing', 2),
    ('Battle Through the Heavens',
     'A genius prodigy loses his power overnight and must reclaim his place among the strong.',
     'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
     array['Action','Martial Arts','Drama'], 'completed', 1)
  returning id, title
)
insert into public.episodes (anime_id, episode_number, title, thumbnail, subtitles, servers)
select a.id, e.n, e.t, e.thumb, e.subs::jsonb, e.srv::jsonb
from a
join (values
  ('Soul Land: Awakening', 1, 'The Spirit Within',
   'https://images.unsplash.com/photo-1601933470096-0e34634ffcde?w=400&q=80',
   '[{"lang":"English","url":"https://example.com/subs/sl-e1.vtt"}]',
   '[{"name":"Server 1","url":"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"},{"name":"Server 2","url":"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"}]'),
  ('Soul Land: Awakening', 2, 'First Trial',
   'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=400&q=80',
   '[]',
   '[{"name":"Server 1","url":"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"}]'),
  ('Throne of Seal', 1, 'Return of the Demons',
   'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=400&q=80',
   '[]',
   '[{"name":"Server 1","url":"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"}]'),
  ('Throne of Seal', 2, 'The Sealing Art',
   'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&q=80',
   '[]',
   '[{"name":"Server 1","url":"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"}]'),
  ('Battle Through the Heavens', 1, 'Fallen Genius',
   'https://images.unsplash.com/photo-1620336655055-bd87ba0f8a8e?w=400&q=80',
   '[]',
   '[{"name":"Server 1","url":"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"}]')
) as e(title, n, t, thumb, subs, srv)
on a.title = e.title;
