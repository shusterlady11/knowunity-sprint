import { motionTokens } from './tokenData';
import { TokenRow } from './parts';
import { LoadingIcon } from '../icons/LoadingIcon';
import { IconSlot } from '../components/iconSlot/IconSlot';
import './foundations.css';

export function Motion() {
  return (
    <div className="fd-page">
      <p className="fd-intro">
        Timing for animation. The samples move with each token applied; when the device has
        &quot;reduce motion&quot; turned on they stay still, as the components do. Values are read
        from build/css/tokens.css and descriptions from tokens/motion.json, which is code-only
        because Figma can&apos;t store motion.
      </p>
      <section className="fd-section">
        <h2 className="fd-section-title">Duration and easing</h2>
        <div className="fd-list">
          {motionTokens().map((token) => (
            <TokenRow
              key={token.dotName}
              token={token}
              visual={
                token.type === 'duration' ? (
                  <IconSlot size="400">
                    <LoadingIcon className="fd-motion-spin" />
                  </IconSlot>
                ) : (
                  <div className="fd-motion-track">
                    <div className="fd-motion-dot" />
                  </div>
                )
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}
