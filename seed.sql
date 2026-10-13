-- Starting content. Running this file DELETES everything in the database and
-- replaces it with what is written here.
--
-- Local copy (safe, use freely):  npm run db:seed
-- Live site (destructive):        npm run db:seed:remote:overwrite
--
-- The live site is edited from the dashboard at /admin, so this file no longer
-- matches it. Seeding the live site throws away every dashboard edit. The
-- overwrite command saves a copy to backups/live.sql first.

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
  ('Java', 'Languages', 5),
  ('Rust', 'Languages', 6),
  ('HTML/CSS', 'Languages', 7),
  ('React', 'Frameworks and libraries', 1),
  ('Next.js', 'Frameworks and libraries', 2),
  ('Node.js', 'Frameworks and libraries', 3),
  ('FastAPI', 'Frameworks and libraries', 4),
  ('Flutter', 'Frameworks and libraries', 5),
  ('Tailwind CSS', 'Frameworks and libraries', 6),
  ('Bootstrap', 'Frameworks and libraries', 7),
  ('Pandas', 'Frameworks and libraries', 8),
  ('NumPy', 'Frameworks and libraries', 9),
  ('Scikit-learn', 'Frameworks and libraries', 10),
  ('XGBoost', 'Frameworks and libraries', 11),
  ('Matplotlib', 'Frameworks and libraries', 12),
  ('PostgreSQL', 'Data, cloud and DevOps', 1),
  ('MySQL', 'Data, cloud and DevOps', 2),
  ('Supabase', 'Data, cloud and DevOps', 3),
  ('Cloudflare (Pages, R2)', 'Data, cloud and DevOps', 4),
  ('Docker', 'Data, cloud and DevOps', 5),
  ('Apache Airflow', 'Data, cloud and DevOps', 6),
  ('Kestra', 'Data, cloud and DevOps', 7),
  ('OpenAI API', 'AI', 1),
  ('Whisper', 'AI', 2),
  ('Hugging Face', 'AI', 3),
  ('sentence-transformers', 'AI', 4),
  ('VectorDB', 'AI', 5),
  ('Git', 'Tools', 1),
  ('GitHub', 'Tools', 2),
  ('Figma', 'Tools', 3),
  ('Power BI', 'Tools', 4),
  ('Excel', 'Tools', 5),
  ('Trello', 'Tools', 6);

INSERT INTO skills (name, description, sort_order) VALUES
  ('Data engineering', 'ETL pipelines and data warehouses, from ingestion to a Kimball star schema that keeps accurate history.', 1),
  ('Full-stack web development', 'Responsive sites and web apps with React and Next.js on the front, FastAPI or Node.js behind, and Supabase or PostgreSQL for data.', 2),
  ('Machine learning and AI', 'From scikit-learn and XGBoost models to fine-tuned multilingual transformers and speech pipelines built on Whisper and the OpenAI API.', 3),
  ('Data visualization', 'Dashboards and charts in Power BI and Matplotlib that turn raw tables into KPIs people can act on.', 4),
  ('Mobile development', 'Android apps built with Flutter.', 5),
  ('Interface design', 'Mocking up screens in Figma first, then carrying a brand''s look through to the finished product.', 6);

-- kind is 'experience', 'education' or 'award'. skills is one per line.
INSERT INTO experiences (role, organization, kind, start_date, end_date, description, skills, sort_order) VALUES
  ('Technology and Innovation Intern', 'HYT Foundation (Helping Youth Transcend Foundation Inc.)', 'experience', '2026-06', '2026-08', 'Developed a learning management system for HYT Global Institute on Cloudflare Pages, Supabase and Cloudflare R2, and built five QR-based registration and booking systems for partner companies. Wrote infrastructure proposals for the five-floor HYT Business Center and led a small team of fellow interns.', 'Next.js
TypeScript
Supabase
Cloudflare (Pages, R2)
GitHub', 1),
  ('BS Computer Science, Data Science specialization', 'University of Santo Tomas', 'education', NULL, '2027-06', 'Consistent Dean''s Lister. Coursework in data warehousing, machine learning, data analysis and visualization, software engineering, web development, mobile app development and graphics computing.', '', 2),
  ('First place, CodeWarts Hackathon', 'UST College of Information and Computing Sciences', 'award', '2026-05', '2026-05', 'Led a team of four to build sana.AI in two days: a voice-powered career guidance app for Filipino informal workers without formal credentials.', '', 3),
  ('TechDev Staff', 'UST Computer Science Society', 'experience', NULL, NULL, 'Built the About page for Save Sierra Madre, the society''s petition and publications site for the Save Sierra Madre Network Alliance.', 'Next.js
React
TypeScript
Tailwind CSS', 4),
  ('Hackathon participant', 'BPI DataWave, GCash ImaGnation and Hackfest', 'award', '2025', '2025', '', '', 5);

INSERT INTO projects (slug, title, summary, description, image_url, live_url, repo_url, featured, sort_order) VALUES
  ('sana-ai', 'sana.AI',
   'A voice-powered career guidance app that turns spoken work stories into skills assessments and TESDA certification roadmaps, for workers without formal credentials.',
   'First place at the UST CICS CodeWarts Hackathon. I led a team of four, built the AI pipeline and designed the initial UI.',
   '/projects/sana-ai.webp', NULL, 'https://github.com/jibi2n/Git-Gud---CodeWarts-Hackathon-', 1, 1),
  ('dollys-closet', 'Dolly''s Closet',
   'A live online store catalog for a local ukay-ukay clothing store, with filters, the brand''s identity built into the design, and inventory and order management behind it.',
   'Fully responsive storefront with a Supabase-backed inventory and order system, real-time updates and secure login.',
   '/projects/dollys-closet.webp', 'https://www.dollysclosetph.com', NULL, 1, 2),
  ('shopzada-data-warehouse', 'ShopZada Data Warehouse',
   'ETL pipeline and Kimball star-schema warehouse for a multi-department e-commerce dataset, with Power BI dashboards on top.',
   'Data warehousing capstone. I designed the hybrid ETL pipeline, wrote the data cleaning scripts and tracked history with SCD Type 2.',
   '/projects/shopzada-data-warehouse.webp', NULL, 'https://github.com/n4t5Uuu/dwh_finalproject_3CSC_group_Lakers-Showtime', 1, 3),
  ('pawsfolio', 'pAWSfolio',
   'A shared showcase where AWS Builders - UST members post what they built, then browse, bump and comment on each other''s work.',
   'Built for the AWS Builders - UST developer assessment. Every component is hand-written, with no templates or UI kits.',
   '/projects/pawsfolio.webp', 'https://13-250-202-11.sslip.io', 'https://github.com/jibi2n/pAWSfolio', 1, 4),
  ('digimon-pets', 'Digimon Pets for VS Code',
   'A VS Code extension that puts Digimon in your sidebar, where they react to your coding activity.',
   'Hobby project inspired by vscode-pets and vscode-pokemon.',
   '/projects/digimon-pets.webp', NULL, 'https://github.com/jibi2n/Digimon-Pets-for-VS-Code', 1, 6),
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
  (p.slug = 'sana-ai' AND t.name IN ('Next.js', 'TypeScript', 'Tailwind CSS', 'FastAPI', 'Python', 'Whisper', 'OpenAI API', 'Supabase')) OR
  (p.slug = 'dollys-closet' AND t.name IN ('Next.js', 'React', 'Tailwind CSS', 'Supabase')) OR
  (p.slug = 'shopzada-data-warehouse' AND t.name IN ('Python', 'Pandas', 'PostgreSQL', 'Docker', 'Apache Airflow', 'Power BI')) OR
  (p.slug = 'pawsfolio' AND t.name IN ('Next.js', 'React', 'TypeScript', 'Tailwind CSS')) OR
  (p.slug = 'digimon-pets' AND t.name IN ('TypeScript')) OR
  (p.slug = 'pomodoro-app' AND t.name IN ('Flutter')) OR
  (p.slug = 'save-sierra-madre' AND t.name IN ('Next.js', 'React', 'TypeScript', 'Tailwind CSS')) OR
  (p.slug = 'mokuteki' AND t.name IN ('JavaScript'));

-- Text for each project's detail panel.
-- details: the longer description (leave a blank line between paragraphs).
-- log: what I did, one entry per line.
UPDATE projects SET
  details = 'sana.AI is a voice-powered career guidance app for Filipino informal workers who have real skills but no formal credentials to prove them. A worker tells their work story out loud in English, Filipino or Taglish, and the app turns it into a skills assessment and a TESDA certification roadmap, starting with the Welding SMAW NC II pathway.

It was built in two days at the UST CICS CodeWarts Hackathon, where it won first place.',
  log = 'Led a team of four to build the app in two days.
Built the AI pipeline that turns spoken work stories into skills assessments and TESDA certification roadmaps.
Fine-tuned an XLM-RoBERTa model for multilingual intent classification.
Designed the initial UI.'
WHERE slug = 'sana-ai';

UPDATE projects SET
  details = 'A live, fully responsive online store catalog for Dolly''s Closet, a local ukay-ukay clothing store. Shoppers browse the catalog and narrow it down with filters, and the store''s brand identity is built into the design. Behind it is an inventory and order management system for the owner.',
  log = 'Built the product catalog, the filters and the brand-led design.
Set up Supabase for inventory, order management, real-time updates and secure login.'
WHERE slug = 'dollys-closet';

UPDATE projects SET
  details = 'A data warehouse for ShopZada, a multi-department e-commerce dataset, built as the capstone for my Data Warehousing course with a team of eight. Raw files from each department are ingested, cleaned and loaded into a Kimball star schema, then surfaced as business KPIs in Power BI.',
  log = 'Designed the hybrid ETL pipeline, run with Apache Airflow in Docker.
Wrote all of the data cleaning scripts.
Built the Kimball star schema with SCD Type 2 to keep an accurate history of changing records across departments.
Created the Power BI dashboards that show the key business KPIs.'
WHERE slug = 'shopzada-data-warehouse';

UPDATE projects SET
  details = 'pAWSfolio is a shared showcase for members of AWS Builders - UST. Members post what they have built with AWS, browse each other''s work, bump the builds they like and leave comments. I built it as my submission for the organization''s developer assessment, which asked for a blog-style app and banned templates and UI kits of any kind.',
  log = 'Built the five required features: create a post, view all posts, view one post with its comments, add a comment and delete a comment.
Went beyond the brief with accounts, bumps, image and GIF uploads, search, tag filters, sorting and pagination.
Wrote every component by hand, from the nav to the modal, because the assessment did not allow component libraries.
Mocked the design up in Figma first, then added a purple dark mode and interactive clouds on the landing page.'
WHERE slug = 'pawsfolio';

UPDATE projects SET
  details = 'The website of the Save Sierra Madre Network Alliance, built by the UST Computer Science Society. Visitors can read about the alliance, sign its petition, leave a note and read its publications, and the alliance''s staff manage it all from an admin dashboard.',
  log = 'Built the About page: the hero, the vision and mission, and the core values sections.
Worked in a shared codebase alongside the society''s other developers.'
WHERE slug = 'save-sierra-madre';

UPDATE projects SET
  details = 'A VS Code extension that puts a Digimon in your sidebar. It walks around, idles and reacts to what you are doing in the editor. It started as a hobby project inspired by vscode-pets and vscode-pokemon.',
  log = 'Built the sidebar panel as a VS Code webview view.
Wrote the animation loop and the state machine that decide when the Digimon walks and when it idles.
Hooked into editor events so it reacts to coding activity.'
WHERE slug = 'digimon-pets';

-- Which fields each project belongs to (one per line). The Projects page filters by these.
UPDATE projects SET specializations = 'AI
Web Development' WHERE slug = 'sana-ai';
UPDATE projects SET specializations = 'Web Development' WHERE slug IN ('dollys-closet', 'pawsfolio', 'save-sierra-madre');
UPDATE projects SET specializations = 'Data Engineering & Analytics' WHERE slug = 'shopzada-data-warehouse';
UPDATE projects SET specializations = 'Software Engineering' WHERE slug IN ('digimon-pets', 'pomodoro-app', 'mokuteki');
