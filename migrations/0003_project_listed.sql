-- Whether a project appears on the Projects page (/projects).
-- Showcased projects always appear there; this is for the rest.
ALTER TABLE projects ADD COLUMN listed INTEGER NOT NULL DEFAULT 1;
