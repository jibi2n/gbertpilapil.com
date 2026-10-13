-- Site content. Safe to re-run: it replaces everything.
-- Apply with `npm run db:seed` (local) or `npm run db:seed:remote` (live).

DELETE FROM project_technologies;
DELETE FROM projects;
DELETE FROM experiences;
DELETE FROM skills;
DELETE FROM technologies;

INSERT INTO technologies (name, category, sort_order) VALUES
  ('Python', 'Languages', 1),
  ('JavaScript', 'Languages', 2),
  ('TypeScript', 'Languages', 3),
  ('SQL', 'Languages', 4),
  ('HTML/CSS', 'Languages', 5),
  ('Java', 'Languages', 6),
  ('Rust', 'Languages', 7),
  ('React', 'Frameworks and libraries', 1),
  ('Next.js', 'Frameworks and libraries', 2),
  ('Node.js', 'Frameworks and libraries', 3),
  ('Flutter', 'Frameworks and libraries', 4),
  ('Tailwind CSS', 'Frameworks and libraries', 5),
  ('Bootstrap', 'Frameworks and libraries', 6),
  ('Scikit-learn', 'Frameworks and libraries', 7),
  ('Pandas', 'Frameworks and libraries', 8),
  ('NumPy', 'Frameworks and libraries', 9),
  ('OpenAI', 'Frameworks and libraries', 10),
  ('PostgreSQL', 'Databases and cloud', 1),
  ('MySQL', 'Databases and cloud', 2),
  ('Supabase', 'Databases and cloud', 3),
  ('Docker', 'DevOps', 1),
  ('Apache Airflow', 'DevOps', 2),
  ('Kestra', 'DevOps', 3),
  ('Figma', 'Tools', 1),
  ('Git', 'Tools', 2),
  ('Power BI', 'Tools', 3),
  ('Matplotlib', 'Tools', 4),
  ('Excel', 'Tools', 5),
  ('Trello', 'Tools', 6);

INSERT INTO skills (name, description, sort_order) VALUES
  ('Data engineering', 'ETL pipelines and data warehouses, from ingestion to a Kimball star schema that keeps accurate history.', 1),
  ('Full-stack web development', 'Responsive sites and web apps with React, Next.js and Node.js, backed by Supabase or PostgreSQL.', 2),
  ('Machine learning', 'Training and fine-tuning open-source models with scikit-learn and Pandas so they fit the data at hand.', 3),
  ('Data visualization', 'Dashboards and charts in Power BI and Matplotlib that turn raw tables into KPIs people can act on.', 4),
  ('Mobile development', 'Android apps built with Flutter.', 5),
  ('Interface design', 'Mocking up screens in Figma first, then carrying a brand''s look through to the finished product.', 6);

INSERT INTO experiences (role, organization, start_date, end_date, description, sort_order) VALUES
  ('BS Computer Science, Data Science specialization', 'University of Santo Tomas', NULL, '2027-06', 'Consistent Dean''s Lister. Coursework in data warehousing, machine learning, software engineering, web development and mobile app development.', 1),
  ('First place, CodeWarts Hackathon', 'UST College of Information and Computing Sciences', '2026', '2026', 'Led a team of four to build Sana.AI, an MVP that helps informal workers without formal credentials find jobs they qualify for.', 2),
  ('TechDev Staff', 'UST Computer Science Society', NULL, NULL, 'Built the About page for Save Sierra Madre, the society''s petition and publications site for the Save Sierra Madre Network Alliance.', 3),
  ('Media Staff', 'UST AWS Club', NULL, NULL, '', 4),
  ('Participant, Datawave 2025', 'BPI', '2025', '2025', '', 5),
  ('Participant, ImaGnation 2025', 'GCash', '2025', '2025', '', 6);

INSERT INTO projects (slug, title, summary, description, image_url, live_url, repo_url, featured, sort_order) VALUES
  ('sana-ai', 'Sana.AI',
   'Turns a spoken Taglish story into recognized skills, a TESDA readiness score and matching jobs, for workers with no resume or diploma.',
   'First place at the UST CICS CodeWarts Hackathon. I led a team of four and worked on the machine learning pipeline and the user experience.',
   NULL, NULL, 'https://github.com/jibi2n/Git-Gud---CodeWarts-Hackathon-', 1, 1),
  ('dollys-closet', 'Dolly''s Closet',
   'Online store for a local fashion brand, with a product catalog, filtering, and inventory and order management behind it.',
   'Fully responsive storefront with a Supabase-backed inventory and order system, real-time updates and secure sign-in.',
   '/projects/dollys-closet.webp', 'https://www.dollysclosetph.com', NULL, 1, 2),
  ('shopzada-data-warehouse', 'ShopZada Data Warehouse',
   'ETL pipeline and Kimball star-schema warehouse for a multi-department e-commerce dataset, with Power BI dashboards on top.',
   'Data warehousing capstone. I architected the hybrid ETL pipeline, wrote the data-cleaning scripts and tracked history with SCD Type 2.',
   NULL, NULL, 'https://github.com/n4t5Uuu/dwh_finalproject_3CSC_group_Lakers-Showtime', 1, 3),
  ('pawsfolio', 'pAWSfolio',
   'A shared showcase where AWS Builders - UST members post what they built, then browse, bump and comment on each other''s work.',
   'Built for the AWS Builders - UST developer assessment. Every component is hand-written, with no templates or UI kits.',
   '/projects/pawsfolio.webp', 'https://13-250-202-11.sslip.io', 'https://github.com/jibi2n/pAWSfolio', 1, 4),
  ('digimon-pets', 'Digimon Pets for VS Code',
   'A VS Code extension that puts Digimon in your sidebar, where they react to your coding activity.',
   'Hobby project inspired by vscode-pets and vscode-pokemon.',
   NULL, NULL, 'https://github.com/jibi2n/Digimon-Pets-for-VS-Code', 1, 6),
  ('pomodoro-app', 'Pomodoro App',
   'A simple timer app for Android, built with Flutter.',
   'Team final project for an applications development course.',
   NULL, NULL, 'https://github.com/jibi2n/POMODORO-App', 0, 7),
  ('save-sierra-madre', 'Save Sierra Madre',
   'Petition and publications site for the Save Sierra Madre Network Alliance, built by the UST Computer Science Society.',
   'Team project. I built the About page: the hero, the vision and mission, and the core values sections.',
   '/projects/save-sierra-madre.webp', NULL, NULL, 1, 5),
  ('mokuteki', 'Mokuteki',
   'A browser extension to-do list with deadlines. Tasks sort by date and overdue ones turn red.',
   '',
   NULL, NULL, 'https://github.com/jibi2n/Mokuteki', 0, 8);

INSERT INTO project_technologies (project_id, technology_id)
SELECT p.id, t.id FROM projects p JOIN technologies t ON
  (p.slug = 'sana-ai' AND t.name IN ('Next.js', 'Tailwind CSS', 'Python', 'Supabase')) OR
  (p.slug = 'dollys-closet' AND t.name IN ('React', 'Tailwind CSS', 'Node.js', 'Supabase')) OR
  (p.slug = 'shopzada-data-warehouse' AND t.name IN ('Python', 'Pandas', 'PostgreSQL', 'Docker', 'Apache Airflow', 'Power BI')) OR
  (p.slug = 'pawsfolio' AND t.name IN ('Next.js', 'React', 'TypeScript', 'Tailwind CSS')) OR
  (p.slug = 'digimon-pets' AND t.name IN ('TypeScript')) OR
  (p.slug = 'pomodoro-app' AND t.name IN ('Flutter')) OR
  (p.slug = 'save-sierra-madre' AND t.name IN ('Next.js', 'React', 'TypeScript', 'Tailwind CSS')) OR
  (p.slug = 'mokuteki' AND t.name IN ('JavaScript'));
