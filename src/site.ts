/** Text that is about me rather than a list. Lists (projects, experience, skills, tech) live in the database. */
export const site = {
  name: 'Gbert O. Pilapil',
  title: 'Gbert O. Pilapil | Software and data developer',
  description:
    'Portfolio of Gbert O. Pilapil, a computer science student at the University of Santo Tomas who builds data pipelines, web apps and mobile apps.',
  /** Typed out one at a time under the name: "I'm a ...". Each should read naturally after "a". */
  roles: ['Developer', 'UI/UX Designer', 'Student', 'Dreamer'],
  location: 'Quezon City, Philippines',
  /** The pitch at the top of the Summary theme. Keep it to two or three sentences. */
  summary:
    "Fourth-year computer science student at the University of Santo Tomas, specializing in data science, and a consistent Dean's Lister. I've shipped applications with different teams, most recently as a Technology and Innovation Intern at HYT Foundation, and I'm deeply interested in AI.",
  tagline: 'I build data pipelines, web apps and the occasional VS Code pet.',
  about: {
    statement:
      'I like building things end to end, from the pipeline that cleans the data to the screen someone actually uses.',
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
