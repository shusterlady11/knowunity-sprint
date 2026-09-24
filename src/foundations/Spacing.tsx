import { spacingTokens } from './tokenData';
import { Description, ResolvedValue } from './parts';
import './foundations.css';

export function Spacing() {
  return (
    <div className="fd-page">
      <p className="fd-intro">
        Every spacing step as a bar of that width. Negative steps are drawn as dashed bars of
        the same length; they pull elements closer together instead of pushing them apart.
        Values are read from build/css/tokens.css and descriptions from tokens/tokens.json.
      </p>
      <div className="fd-list">
        {spacingTokens().map((token) => {
          const isNegative = token.path[1].startsWith('negative');
          return (
            <article className="fd-space-row" key={token.dotName} data-token={token.dotName}>
              <div className="fd-bar-track">
                <div
                  className={isNegative ? 'fd-bar fd-bar-negative' : 'fd-bar'}
                  style={{ width: isNegative ? `calc(var(${token.cssVar}) * -1)` : `var(${token.cssVar})` }}
                />
              </div>
              <div>
                <h3 className="fd-name">{token.dotName}</h3>
                <p className="fd-value">{token.cssVar}</p>
                <ResolvedValue cssVar={token.cssVar} />
                <Description text={token.description} />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
