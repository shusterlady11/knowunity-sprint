import { scripts } from '../../../content/scripts';
import { MessageScreen } from '../../MessageScreen';
import { EntryScreen } from './EntryScreen';

/** Entry link (SPEC.md › 5): the moderator's link. The code picks a stored script. */
export default async function EntryPage({ params }: PageProps<'/s/[code]'>) {
  const { code } = await params;

  // An unknown code can only be a mistyped or old link, so it says so rather than guessing a script.
  if (!(code in scripts)) {
    return (
      <MessageScreen
        expression="confused"
        title="This link doesn’t work"
        caption="Ask the person running the session for a new link."
      />
    );
  }

  return <EntryScreen code={code} />;
}
