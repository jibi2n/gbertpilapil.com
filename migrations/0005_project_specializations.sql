-- The fields a project belongs to, such as "Web Development" or "AI", one per
-- line. A project can have more than one. The Projects page filters by these.
ALTER TABLE projects ADD COLUMN specializations TEXT NOT NULL DEFAULT '';
