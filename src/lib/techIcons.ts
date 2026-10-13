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
} from 'simple-icons';

/**
 * Logo for each technology, keyed by the name used in the database.
 * The logos come from the Simple Icons set. A technology with no entry here
 * (the set has no logo for it) is shown as its name alone.
 * Each value is the SVG path for a 24x24 icon.
 */
const icons: Record<string, string> = {
  Python: siPython.path,
  JavaScript: siJavascript.path,
  TypeScript: siTypescript.path,
  Java: siOpenjdk.path,
  Rust: siRust.path,
  'HTML/CSS': siHtml5.path,
  React: siReact.path,
  'Next.js': siNextdotjs.path,
  'Node.js': siNodedotjs.path,
  FastAPI: siFastapi.path,
  Flutter: siFlutter.path,
  'Tailwind CSS': siTailwindcss.path,
  Bootstrap: siBootstrap.path,
  Pandas: siPandas.path,
  NumPy: siNumpy.path,
  'Scikit-learn': siScikitlearn.path,
  PostgreSQL: siPostgresql.path,
  MySQL: siMysql.path,
  Supabase: siSupabase.path,
  'Cloudflare (Pages, R2)': siCloudflare.path,
  Docker: siDocker.path,
  'Apache Airflow': siApacheairflow.path,
  'Hugging Face': siHuggingface.path,
  Git: siGit.path,
  GitHub: siGithub.path,
  Figma: siFigma.path,
  Trello: siTrello.path,
};

export function techIcon(name: string): string | null {
  return icons[name] ?? null;
}
