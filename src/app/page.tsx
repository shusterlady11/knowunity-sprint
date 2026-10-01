import { redirect } from 'next/navigation';

// Until the entry link (/s/[code]) exists, the app's home address goes straight to the first-run splash.
export default function Home() {
  redirect('/start');
}
