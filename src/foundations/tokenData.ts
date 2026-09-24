import tokens from '../../tokens/tokens.json';

export type Token = {
  path: string[];
  dotName: string;
  cssVar: string;
  type: string;
  description: string | null;
};

export type ColorGroup = {
  id: string;
  title: string;
  kind: 'semantic' | 'primitive' | 'legacy';
  tokens: Token[];
};

export type TextStyle = {
  path: string[];
  dotName: string;
  label: string;
  cssPrefix: string;
  description: string | null;
};

type Node = Record<string, unknown>;

const isNode = (value: unknown): value is Node =>
  typeof value === 'object' && value !== null;

const isToken = (value: unknown): value is Node =>
  isNode(value) && '$value' in value;

const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

// Mirrors the name/pathVerbatim transform in style-dictionary.config.mjs.
function cssVarName(path: string[], type: string) {
  const segments = type === 'color' && path[0] !== 'color' ? ['color', ...path] : path;
  return `--${segments.join('-')}`;
}

function collectTokens(node: Node, path: string[], out: Token[]) {
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$') || !isNode(child)) continue;
    const next = [...path, key];
    if (isToken(child)) {
      const type = String(child.$type);
      out.push({
        path: next,
        dotName: next.join('.'),
        cssVar: cssVarName(next, type),
        type,
        description: typeof child.$description === 'string' && child.$description !== '' ? child.$description : null,
      });
    } else {
      collectTokens(child, next, out);
    }
  }
}

const allTokens: Token[] = [];
collectTokens(tokens as Node, [], allTokens);

export function colorGroups(): ColorGroup[] {
  const groups = new Map<string, ColorGroup>();
  for (const token of allTokens.filter((t) => t.type === 'color')) {
    const id = token.path[0];
    if (!groups.has(id)) {
      const kind = id === 'color' ? 'primitive' : /^[A-Z]/.test(id) ? 'legacy' : 'semantic';
      const title =
        kind === 'primitive' ? 'Primitive palette' : kind === 'legacy' ? `${id} (legacy)` : capitalize(id);
      groups.set(id, { id, title, kind, tokens: [] });
    }
    groups.get(id)!.tokens.push(token);
  }
  const order = { semantic: 0, primitive: 1, legacy: 2 };
  return [...groups.values()].sort((a, b) => order[a.kind] - order[b.kind]);
}

export const spacingTokens = () => allTokens.filter((t) => t.path[0] === 'space');

export const radiusTokens = () => allTokens.filter((t) => t.path[0] === 'radius');

export function textStyles(): TextStyle[] {
  const out: TextStyle[] = [];
  const visit = (node: Node, path: string[]) => {
    for (const [key, child] of Object.entries(node)) {
      if (key.startsWith('$') || !isNode(child)) continue;
      const next = [...path, key];
      if (isToken(child.fontFamily)) {
        const [, group, size, weight] = next;
        out.push({
          path: next,
          dotName: next.join('.'),
          label: `${capitalize(group)} ${size.toUpperCase()}${weight ? ` ${weight}` : ''}`,
          cssPrefix: `--${next.join('-')}`,
          description: typeof child.$description === 'string' && child.$description !== '' ? child.$description : null,
        });
      } else {
        visit(child, next);
      }
    }
  };
  visit((tokens as Node).type as Node, ['type']);
  return out;
}

export function resolveVar(cssVar: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
  return value === '' ? null : value;
}
