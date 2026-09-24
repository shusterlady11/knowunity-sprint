import { controlTokens, iconSizeTokens, illustrationTokens, indicatorTokens, strokeTokens } from './tokenData';
import { TokenRow } from './parts';
import './foundations.css';

export function Sizes() {
  return (
    <div className="fd-page">
      <p className="fd-intro">
        Fixed sizes for controls, icons, illustrations, indicator dots and border lines. These are sizes, not
        spacing, so they are not part of the spacing scale. Values are read from
        build/css/tokens.css and descriptions from tokens/tokens.json.
      </p>
      <section className="fd-section">
        <h2 className="fd-section-title">Control</h2>
        <div className="fd-list">
          {controlTokens().map((token) => (
            <TokenRow
              key={token.dotName}
              token={token}
              visual={
                <div
                  className={token.path[1] === 'touch-target' ? 'fd-control-bar fd-control-target' : 'fd-control-bar'}
                  style={{ height: `var(${token.cssVar})` }}
                />
              }
            />
          ))}
        </div>
      </section>
      <section className="fd-section">
        <h2 className="fd-section-title">Icon</h2>
        <div className="fd-list">
          {iconSizeTokens().map((token) => (
            <TokenRow
              key={token.dotName}
              token={token}
              visual={
                <div className="fd-icon-box" style={{ width: `var(${token.cssVar})`, height: `var(${token.cssVar})` }} />
              }
            />
          ))}
        </div>
      </section>
      <section className="fd-section">
        <h2 className="fd-section-title">Illustration</h2>
        <div className="fd-list">
          {illustrationTokens().map((token) => (
            <TokenRow
              key={token.dotName}
              token={token}
              wide
              visual={
                <div className="fd-icon-box" style={{ width: `var(${token.cssVar})`, height: `var(${token.cssVar})` }} />
              }
            />
          ))}
        </div>
      </section>
      <section className="fd-section">
        <h2 className="fd-section-title">Indicator</h2>
        <div className="fd-list">
          {indicatorTokens().map((token) => (
            <TokenRow
              key={token.dotName}
              token={token}
              visual={<div className="fd-indicator-dot" style={{ width: `var(${token.cssVar})`, height: `var(${token.cssVar})` }} />}
            />
          ))}
        </div>
      </section>
      <section className="fd-section">
        <h2 className="fd-section-title">Stroke</h2>
        <div className="fd-list">
          {strokeTokens().map((token) => (
            <TokenRow
              key={token.dotName}
              token={token}
              visual={<div className="fd-stroke-line" style={{ height: `var(${token.cssVar})` }} />}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
