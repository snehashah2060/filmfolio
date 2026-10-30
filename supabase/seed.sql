-- ========================================================
-- FILMFOLIO SEED DATA - REAL MOVIE METADATA
-- ========================================================

INSERT INTO public.movies (tmdb_id, title, overview, poster_path, backdrop_path, release_date, runtime, original_language, genres, tmdb_rating)
VALUES
(
  27205,
  'Inception',
  'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: "inception", the implantation of another person''s idea into a target''s subconscious.',
  '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
  '/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
  '2010-07-15',
  148,
  'en',
  '[{"id": 28, "name": "Action"}, {"id": 878, "name": "Science Fiction"}, {"id": 12, "name": "Adventure"}]'::jsonb,
  8.4
),
(
  157336,
  'Interstellar',
  'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
  '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
  '/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
  '2014-11-05',
  169,
  'en',
  '[{"id": 12, "name": "Adventure"}, {"id": 18, "name": "Drama"}, {"id": 878, "name": "Science Fiction"}]'::jsonb,
  8.4
),
(
  238,
  'The Godfather',
  'Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.',
  '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
  '/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
  '1972-03-14',
  175,
  'en',
  '[{"id": 18, "name": "Drama"}, {"id": 80, "name": "Crime"}]'::jsonb,
  8.7
),
(
  680,
  'Pulp Fiction',
  'A burger-loving hit man, his philosophical partner, a drug-addled gangster''s moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.',
  '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
  '/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
  '1994-09-10',
  154,
  'en',
  '[{"id": 53, "name": "Thriller"}, {"id": 80, "name": "Crime"}]'::jsonb,
  8.5
),
(
  496243,
  'Parasite',
  'All unemployed, Ki-taek''s family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.',
  '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
  '/hiKmpZMGZsrkA3cdce8a7Dpos1j.jpg',
  '2019-05-30',
  133,
  'ko',
  '[{"id": 35, "name": "Comedy"}, {"id": 53, "name": "Thriller"}, {"id": 18, "name": "Drama"}]'::jsonb,
  8.5
),
(
  129,
  'Spirited Away',
  'A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.',
  '/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
  '/Ab8mkHmkYADjU7wQiOkia9BzGvS.jpg',
  '2001-07-20',
  125,
  'ja',
  '[{"id": 16, "name": "Animation"}, {"id": 10751, "name": "Family"}, {"id": 14, "name": "Fantasy"}]'::jsonb,
  8.5
)
ON CONFLICT (tmdb_id) DO NOTHING;
