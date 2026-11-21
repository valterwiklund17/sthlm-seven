-- Sthlm Seven: separate tournaments + raise capacity to 12 (Night Session)
-- Paste into Supabase SQL Editor and run as a privileged role.

-- 1) Add tournament_id if missing
ALTER TABLE public.teams
  ADD COLUMN IF NOT EXISTS tournament_id text;

-- 2) Mark all existing rows as the previous cup (do not delete any data)
UPDATE public.teams
SET tournament_id = 'zinken-2026'
WHERE tournament_id IS NULL
   OR btrim(tournament_id) = '';

-- 3) Helpful default for future inserts (app still sends tournament_id explicitly)
ALTER TABLE public.teams
  ALTER COLUMN tournament_id SET DEFAULT 'night-session-2027';

-- 4) Inspect CHECK constraints on teams
SELECT
  c.conname AS constraint_name,
  pg_get_constraintdef(c.oid) AS definition
FROM pg_constraint c
WHERE c.conrelid = 'public.teams'::regclass
  AND c.contype = 'c'
ORDER BY c.conname;

-- 5) Inspect triggers on teams
SELECT
  t.tgname AS trigger_name,
  pg_get_triggerdef(t.oid, true) AS definition
FROM pg_trigger t
WHERE t.tgrelid = 'public.teams'::regclass
  AND NOT t.tgisinternal
ORDER BY t.tgname;

-- 6) Inspect functions that mention teams / max capacity (manual review)
SELECT
  n.nspname AS schema,
  p.proname AS function_name,
  pg_get_functiondef(p.oid) AS definition
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE pg_get_functiondef(p.oid) ILIKE '%teams%'
  AND (
    pg_get_functiondef(p.oid) ILIKE '%8%'
    OR pg_get_functiondef(p.oid) ILIKE '%max%'
    OR pg_get_functiondef(p.oid) ILIKE '%capacity%'
    OR pg_get_functiondef(p.oid) ILIKE '%tournament%'
  )
ORDER BY n.nspname, p.proname;

-- 7) Optional capacity helper scoped per tournament (12 for Night Session)
CREATE OR REPLACE FUNCTION public.tournament_is_full(p_tournament_id text)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(COUNT(*), 0) >= 12
  FROM public.teams
  WHERE tournament_id = p_tournament_id;
$$;

-- 8) Verify counts after backfill
SELECT tournament_id, COUNT(*) AS teams
FROM public.teams
GROUP BY tournament_id
ORDER BY tournament_id;
