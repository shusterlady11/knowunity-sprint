import type { CSSProperties } from 'react';
import { fontTokens, resolveVar, textStyles } from './tokenData';
import type { FontGroup, Token } from './tokenData';
import { Description, TokenRow } from './parts';
import './foundations.css';

const sampleText = 'Say it in your own words';

const buildingBlocks: { group: FontGroup; title: string; sample: (token: Token) => CSSProperties }[] = [
  { group: 'size', title: 'Size', sample: (t) => ({ fontSize: `var(${t.cssVar})` }) },
  { group: 'lineHeight', title: 'Line height', sample: () => ({}) },
  { group: 'weight', title: 'Weight', sample: (t) => ({ fontWeight: `var(${t.cssVar})` }) },
  { group: 'family', title: 'Family', sample: (t) => ({ fontFamily: `var(${t.cssVar})` }) },
  { group: 'tracking', title: 'Tracking', sample: (t) => ({ letterSpacing: `var(${t.cssVar})` }) },
];

export function TypeScale() {
  return (
    <div className="fd-page">
      <p className="fd-intro">
        Every text style at its real size, in scale order from largest to smallest, followed by the
        building blocks the styles are made from. Values are read from build/css/tokens.css and
        descriptions from tokens/tokens.json.
      </p>
      <section className="fd-section">
        <h2 className="fd-section-title">Text styles</h2>
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
      </section>
      <section className="fd-section">
        <h2 className="fd-section-title">Building blocks</h2>
        <p className="fd-intro">
          The raw values the text styles above are assembled from. Use a text style in components;
          these are shown so each style can be traced back to its parts.
        </p>
        {buildingBlocks.map(({ group, title, sample }) => (
          <div className="fd-section" key={group}>
            <h3 className="fd-subsection-title">{title}</h3>
            <div className="fd-list">
              {fontTokens(group).map((token) => (
                <TokenRow
                  key={token.dotName}
                  token={token}
                  visual={
                    group === 'lineHeight' ? (
                      <div className="fd-line-height" style={{ height: `var(${token.cssVar})` }} />
                    ) : (
                      <p className="fd-block-sample" style={sample(token)}>
                        {group === 'size' ? 'Aa' : 'Knowie'}
                      </p>
                    )
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
