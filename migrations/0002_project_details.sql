-- Text for the project detail panel.
-- details: the longer description. Blank lines separate paragraphs.
-- log: what I did on the project, one entry per line (a mini dev log).
ALTER TABLE projects ADD COLUMN details TEXT NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN log TEXT NOT NULL DEFAULT '';
