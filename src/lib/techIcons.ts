import {
  siApacheairflow,
  siBootstrap,
  siCloudflare,
  siDocker,
  siFastapi,
  siFigma,
  siFlutter,
  siGit,
  siGithub,
  siHtml5,
  siHuggingface,
  siJavascript,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siNumpy,
  siOpenjdk,
  siPandas,
  siPostgresql,
  siPython,
  siReact,
  siRust,
  siScikitlearn,
  siSupabase,
  siTailwindcss,
  siTrello,
  siTypescript,
  type SimpleIcon,
} from 'simple-icons';

/**
 * Logo for each technology, keyed by the name used in the database.
 * The logos come from the Simple Icons set. A technology with no entry here
 * (the set has no logo for it) is shown as its name alone.
 */
const icons: Record<string, SimpleIcon> = {
  Python: siPython,
  JavaScript: siJavascript,
  TypeScript: siTypescript,
  Java: siOpenjdk,
  Rust: siRust,
  'HTML/CSS': siHtml5,
  React: siReact,
  'Next.js': siNextdotjs,
  'Node.js': siNodedotjs,
  FastAPI: siFastapi,
  Flutter: siFlutter,
  'Tailwind CSS': siTailwindcss,
  Bootstrap: siBootstrap,
  Pandas: siPandas,
  NumPy: siNumpy,
  'Scikit-learn': siScikitlearn,
  PostgreSQL: siPostgresql,
  MySQL: siMysql,
  Supabase: siSupabase,
  'Cloudflare (Pages, R2)': siCloudflare,
  Docker: siDocker,
  'Apache Airflow': siApacheairflow,
  'Hugging Face': siHuggingface,
  Git: siGit,
  GitHub: siGithub,
  Figma: siFigma,
  Trello: siTrello,
};

/** The SVG path for a 24x24 icon. */
export function techIcon(name: string): string | null {
  return icons[name]?.path ?? null;
}

/** The brand's own color, e.g. "#3776AB". */
export function techColor(name: string): string | null {
  return icons[name] ? `#${icons[name].hex}` : null;
}
