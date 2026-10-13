/**
 * The themes on the slider, in slider order. The first one is the default.
 * To add a theme: add an entry here, create src/styles/themes/<id>.css,
 * and import that file in src/styles/global.css.
 */
export const themes = [
  { id: 'professional', label: 'Professional', fonts: ['Schibsted Grotesk Variable'] },
  { id: 'futuristic', label: 'Futuristic', fonts: ['Oxanium Variable', 'Exo 2 Variable'] },
  { id: 'mudkip', label: 'Mudkip', fonts: ['Fredoka Variable', 'Nunito Variable'] },
] as const;

export type ThemeId = (typeof themes)[number]['id'];
