import { resolveVar, textStyles } from './tokenData';
import { Description } from './parts';
import './foundations.css';

const sampleText = 'Say it in your own words';

export function TypeScale() {
  return (
    <div className="fd-page">
      <p className="fd-intro">
        Every text style at its real size, in scale order from largest to smallest. Values are
        read from build/css/tokens.css and descriptions from tokens/tokens.json.
      </p>
      <div className="fd-list">
        {textStyles().map((style) => {
          const family = resolveVar(`${style.cssPrefix}-fontFamily`);
          const weight = resolveVar(`${style.cssPrefix}-fontWeight`);
          const size = resolveVar(`${style.cssPrefix}-fontSize`);
          const lineHeight = resolveVar(`${style.cssPrefix}-lineHeight`);
          const letterSpacing = resolveVar(`${style.cssPrefix}-letterSpacing`);
          return (
            <article className="fd-type-row" key={style.dotName} data-text-style={style.dotName}>
              <p
                className="fd-sample"
                style={{
                  fontFamily: `var(${style.cssPrefix}-fontFamily)`,
                  fontWeight: `var(${style.cssPrefix}-fontWeight)`,
                  fontSize: `var(${style.cssPrefix}-fontSize)`,
                  lineHeight: `var(${style.cssPrefix}-lineHeight)`,
                  letterSpacing: `var(${style.cssPrefix}-letterSpacing)`,
                }}
              >
                {sampleText}
              </p>
              <h3 className="fd-name">{style.label}</h3>
              <p className="fd-value">{style.dotName}</p>
              {family && weight && size && lineHeight && letterSpacing ? (
                <p className="fd-value">
                  {family}, weight {weight}, size {size}, line height {lineHeight}, letter spacing {letterSpacing}
                </p>
              ) : (
                <p className="fd-value fd-error">Not found in tokens.css. Run npm run tokens.</p>
              )}
              <Description text={style.description} />
            </article>
          );
        })}
      </div>
    </div>
  );
}
