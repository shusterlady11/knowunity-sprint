import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Knowie voice recall',
  description: 'Usability-test prototype: explain a concept out loud, and Knowie checks your answer.',
};

// viewportFit 'cover' lets the screen run under the iPhone's status bar and home bar, so Scaffold can
// keep its content clear of them. No themeColor: it would need a literal color, and the app runs full
// screen from the Home Screen on a dark page (docs/open-items.md, D10).
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
