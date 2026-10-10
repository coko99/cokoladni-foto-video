-- Tri kategorije poza (SQL Editor)

UPDATE wedding_pose_categories
SET archived_at = now(), updated_at = now()
WHERE slug NOT IN ('mladenci-zajedno', 'samo-mlada', 'samo-mladozenje')
AND archived_at IS NULL;

INSERT INTO wedding_pose_categories (name, slug, sort_order) VALUES
  ('Mladenci zajedno', 'mladenci-zajedno', 1),
  ('Samo mlada', 'samo-mlada', 2),
  ('Samo mladoženje', 'samo-mladozenje', 3)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  archived_at = NULL,
  updated_at = now();
