'use client';

import { useEffect } from 'react';
import { clearAll } from '../../lib/session';
import { MessageScreen } from '../MessageScreen';

/** Reset (SPEC.md › 5): clears the saved session and the "splash seen" flag between participants. Moderator only. */
export default function ResetPage() {
  useEffect(() => clearAll(), []);

  return (
    <MessageScreen
      expression="standby"
      title="All cleared"
      caption="This phone is ready for the next participant. Open their link to start."
    />
  );
}
