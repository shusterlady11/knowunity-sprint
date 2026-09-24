import { radiusTokens } from './tokenData';
import { Description, ResolvedValue } from './parts';
import './foundations.css';

export function Radius() {
  return (
    <div className="fd-page">
      <p className="fd-intro">
        Every corner radius applied to a box. Values are read from build/css/tokens.css and
        descriptions from tokens/tokens.json.
      </p>
      <div className="fd-grid">
        {radiusTokens().map((token) => (
          <article className="fd-card" key={token.dotName} data-token={token.dotName}>
            <div className="fd-card-body">
              <div className="fd-radius-box" style={{ borderRadius: `var(${token.cssVar})` }} />
              <h3 className="fd-name">{token.dotName}</h3>
              <p className="fd-value">{token.cssVar}</p>
              <ResolvedValue cssVar={token.cssVar} />
              <Description text={token.description} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
