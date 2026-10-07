import type { MetadataRoute } from 'next';

// Makes the Home Screen icon open full screen, with no Safari toolbars (SPEC.md › 5). There's no start_url
// on purpose: the icon then opens the page it was added from, /s/[code], so it keeps the participant's
// code. No colors either: they'd have to be literal values, not tokens (was D10).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Knowie voice recall',
    short_name: 'Knowie',
    description: 'Explain a concept out loud, and Knowie checks your answer.',
    display: 'standalone',
    orientation: 'portrait',
  };
}
