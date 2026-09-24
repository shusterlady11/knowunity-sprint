import { motionTokens } from './tokenData';
import type { Token } from './tokenData';
import { LoadingDots } from '../components/loadingDots/LoadingDots';
import { TokenRow } from './parts';
import { LoadingIcon } from '../icons/LoadingIcon';
import { IconSlot } from '../components/iconSlot/IconSlot';
import './foundations.css';

function sampleFor(token: Token) {
  const cssVar = `var(${token.cssVar})`;
  if (token.type === 'number') {
    // An opacity: the dot at full strength next to the dot at this value.
    return (
      <div className="fd-motion-opacity">
        <div className="fd-motion-dot-static" />
        <div className="fd-motion-dot-static" style={{ opacity: cssVar }} />
      </div>
    );
  }
  if (token.type === 'cubicBezier') {
    return (
      <div className="fd-motion-track">
        <div className="fd-motion-dot" style={{ animationTimingFunction: cssVar }} />
      </div>
    );
  }
  if (token.path[token.path.length - 1] === 'spinner') {
    return (
      <IconSlot size="400">
        <LoadingIcon className="fd-motion-spin" />
      </IconSlot>
    );
  }
  if (token.path[token.path.length - 1] === 'toggle') {
    // The knob slide: 8 durations per loop, so it rests between slides.
    return (
      <div className="fd-motion-track">
        <div className="fd-motion-knob" style={{ animationDuration: `calc(${cssVar} * 8)` }} />
      </div>
    );
  }
  // The pulse tokens: the real component, which is what they drive.
  return <LoadingDots />;
}

export function Motion() {
  return (
    <div className="fd-page">
      <p className="fd-intro">
        Timing for animation. Each sample moves with its own token applied; when the device has
        &quot;reduce motion&quot; turned on they stay still, as the components do. Values are read
        from build/css/tokens.css and descriptions from tokens/motion.json, which is code-only
        because Figma can&apos;t store motion.
      </p>
      <section className="fd-section">
        <h2 className="fd-section-title">Duration, easing and opacity</h2>
        <div className="fd-list">
          {motionTokens().map((token) => (
            <TokenRow key={token.dotName} token={token} visual={sampleFor(token)} />
          ))}
        </div>
      </section>
    </div>
  );
}
