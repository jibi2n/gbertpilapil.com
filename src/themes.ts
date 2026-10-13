/**
 * The themes, in the order you reach them by swiping the top section or using
 * its dots and arrows. The first one is the default for new visitors.
 *
 * "summary" is the short version for employers: it shows the Summary section
 * instead of the full page, and shares its look with "professional".
 *
 * To add a theme: add an entry here, create src/styles/themes/<id>.css,
 * and import that file in src/styles/global.css.
 */
export const themes = [
  { id: 'summary', label: 'Summary', fonts: ['Schibsted Grotesk Variable'] },
  { id: 'professional', label: 'Professional', fonts: ['Schibsted Grotesk Variable'] },
  { id: 'futuristic', label: 'Futuristic', fonts: ['Oxanium Variable', 'Exo 2 Variable'] },
  { id: 'mudkip', label: 'Mudkip', fonts: ['Fredoka Variable', 'Nunito Variable'] },
] as const;

export type ThemeId = (typeof themes)[number]['id'];
