import { shadowTokens } from './tokenData';
import { Description, ResolvedValue } from './parts';
import './foundations.css';

export function Shadows() {
  return (
    <div className="fd-page">
      <p className="fd-intro">
        Bottom bevels: an inset shadow along the lower edge that gives pills and buttons a
        pressed-in look. Each is shown on a primary fill and on a surface fill. Values are read
        from build/css/tokens.css and descriptions from tokens/tokens.json.
      </p>
      <section className="fd-section">
        <h2 className="fd-section-title">Bevels</h2>
        <div className="fd-grid">
          {shadowTokens().map((token) => (
            <article className="fd-card" key={token.dotName} data-token={token.dotName}>
              <div className="fd-card-body">
                <div className="fd-shadow-row">
                  <div className="fd-shadow-sample fd-shadow-primary" style={{ boxShadow: `var(${token.cssVar})` }} />
                  <div className="fd-shadow-sample fd-shadow-surface" style={{ boxShadow: `var(${token.cssVar})` }} />
                </div>
                <h3 className="fd-name">{token.dotName}</h3>
                <p className="fd-value">{token.cssVar}</p>
                <ResolvedValue cssVar={token.cssVar} />
                <Description text={token.description} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
