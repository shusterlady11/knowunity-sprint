import { colorGroups } from './tokenData';
import { Description, ResolvedValue } from './parts';
import './foundations.css';

export function Colors() {
  return (
    <div className="fd-page">
      <p className="fd-intro">
        Every color token, grouped by role. Values are read from build/css/tokens.css and
        descriptions from tokens/tokens.json. Use the semantic groups in components; the
        primitive palette and legacy groups are shown for reference.
      </p>
      {colorGroups().map((group) => (
        <section className="fd-section" key={group.id} data-color-group={group.id}>
          <h2 className="fd-section-title">{group.title}</h2>
          <div className="fd-grid">
            {group.tokens.map((token) => (
              <article className="fd-card" key={token.dotName} data-token={token.dotName}>
                <div className="fd-swatch" style={{ background: `var(${token.cssVar})` }} />
                <div className="fd-card-body">
                  <h3 className="fd-name">{token.dotName}</h3>
                  <p className="fd-value">{token.cssVar}</p>
                  <ResolvedValue cssVar={token.cssVar} />
                  <Description text={token.description} />
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
