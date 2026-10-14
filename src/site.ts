/** Text that is about me rather than a list. Lists (projects, experience, skills, tech) live in the database. */
export const site = {
  name: 'Gbert O. Pilapil',
  title: 'Gbert O. Pilapil | Aspiring Software and Data Engineer',
  description:
    'Portfolio of Gbert O. Pilapil, a computer science student at the University of Santo Tomas, specializing mainly in software engineering and data science.',
  /** Typed out one at a time under the name: "I'm a ...". Each should read naturally after "a". */
  roles: ['Full-stack Developer', 'UI/UX Designer', 'Computer Science Student', 'Data Scientist', 'AI & Automation Enthusiast', 'Researcher'],
  location: 'Quezon City, Philippines',
  /** The pitch at the top of the Summary theme. Keep it to two or three sentences. */
  summary:
    "Hi I am an aspiring Software Engineer or Data Scientist. I enjoy building things and learning new technologies. I am very interested in AI and automation, and I am always looking for ways to expand my skills and knowledge. Most of my experience is in building web applications (mostly full stack), but I can also work with data and other stuff.",
  tagline: 'I build and create software and data solutions, from ideas to production, and from raw data to insights',
  about: {
    statement:
      'I enjoy building things :>',
    paragraphs: [
      "I'm a fourth-year computer science student at the University of Santo Tomas, specializing in data science. My projects sit on both sides of that line: ETL pipelines and data warehouses on one, full-stack web and AI apps on the other.",
      "I recently finished a Technology and Innovation internship at HYT Foundation, where I built a learning management system and led a small team of interns. I'm deeply interested in AI, and just as curious about legacy systems and how they get transformed.",
    ],
    facts: [
      { label: 'Studying', value: 'BS Computer Science, University of Santo Tomas' },
      { label: 'Graduating', value: 'June 2027' },
      { label: 'Based in', value: 'Quezon City, Philippines' },
      { label: 'Latest role', value: 'Technology and Innovation Intern, HYT Foundation' },
    ],
  },
  email: 'gbertpilapil12@gmail.com',
  /** Shown on the business card. Left blank, it is hidden. */
  phone: '',
  /** The business card on the landing view. */
  card: {
    pitch: 'I build web apps, AI tools, and data pipelines.',
    title: 'Full-Stack Developer',
    school: '4th Year BS Computer Science, University of Santo Tomas',
    /** Technology names, as in the database, so they pick up their logos. */
    stack: ['Python', 'TypeScript', 'React', 'Next.js', 'PostgreSQL', 'Supabase'],
  },
  links: [
    { label: 'LinkedIn', href: 'https://linkedin.com/in/gbert-pilapil' },
    { label: 'GitHub', href: 'https://github.com/jibi2n' },
    { label: 'Facebook', href: 'https://facebook.com/gbert.pilapil.3' },
    { label: 'Instagram', href: 'https://instagram.com/gbertttttttt' },
  ],
  sections: [
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'stack', label: 'Stack' },
    { id: 'contact', label: 'Contact' },
  ],
};
