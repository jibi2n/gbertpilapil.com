-- kind: which section an entry belongs to: 'experience' (roles and jobs),
--       'education', or 'award' (awards and activities such as hackathons).
-- skills: the skills used in that role, one per line.
ALTER TABLE experiences ADD COLUMN kind TEXT NOT NULL DEFAULT 'experience';
ALTER TABLE experiences ADD COLUMN skills TEXT NOT NULL DEFAULT '';
