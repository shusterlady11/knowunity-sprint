import { resolveVar } from './tokenData';

export function Description({ text }: { text: string | null }) {
  if (text) return <p className="fd-text">{text}</p>;
  return <p className="fd-text fd-missing">No description in tokens.json.</p>;
}

export function ResolvedValue({ cssVar }: { cssVar: string }) {
  const value = resolveVar(cssVar);
  if (value) return <p className="fd-value">{value}</p>;
  return <p className="fd-value fd-error">Not found in tokens.css. Run npm run tokens.</p>;
}
