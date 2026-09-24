import { controlTokens, iconSizeTokens } from './tokenData';
import type { Token } from './tokenData';
import { Description, ResolvedValue } from './parts';
import './foundations.css';

function SizeRow({ token, visual }: { token: Token; visual: React.ReactNode }) {
  return (
    <article className="fd-space-row" data-token={token.dotName}>
      <div>{visual}</div>
      <div>
        <h3 className="fd-name">{token.dotName}</h3>
        <p className="fd-value">{token.cssVar}</p>
        <ResolvedValue cssVar={token.cssVar} />
        <Description text={token.description} />
      </div>
    </article>
  );
}

export function Sizes() {
  return (
    <div className="fd-page">
      <p className="fd-intro">
        Fixed sizes for controls and icons. These are sizes, not spacing, so they are not part of
        the spacing scale. Values are read from build/css/tokens.css and descriptions from
        tokens/tokens.json.
      </p>
      <section className="fd-section">
        <h2 className="fd-section-title">Control</h2>
        <div className="fd-list">
          {controlTokens().map((token) => (
            <SizeRow
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
            <SizeRow
              key={token.dotName}
              token={token}
              visual={
                <div
                  className="fd-icon-box"
                  style={{ width: `var(${token.cssVar})`, height: `var(${token.cssVar})` }}
                />
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}
