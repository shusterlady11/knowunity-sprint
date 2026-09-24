import StyleDictionary from 'style-dictionary';

StyleDictionary.registerTransform({
  name: 'name/pathVerbatim',
  type: 'name',
  transform: (token) => {
    const isColorOutsideColorGroup =
      token.$type === 'color' && token.path[0] !== 'color';
    const segments = isColorOutsideColorGroup
      ? ['color', ...token.path]
      : token.path;
    return segments.join('-');
  },
});

StyleDictionary.registerTransform({
  name: 'duration/css',
  type: 'value',
  filter: (token) => token.$type === 'duration',
  transform: (token) => `${token.$value.value}${token.$value.unit}`,
});

StyleDictionary.registerTransformGroup({
  name: 'css/tokens',
  transforms: [
    'name/pathVerbatim',
    'color/css',
    'fontFamily/css',
    'size/px',
    'duration/css',
    'cubicBezier/css',
    'shadow/css/shorthand',
  ],
});

const config = {
  source: ['tokens/**/*.json'],
  usesDtcg: true,
  platforms: {
    css: {
      transformGroup: 'css/tokens',
      buildPath: 'build/css/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: {
            fileHeader: () => [
              'GENERATED FILE. DO NOT EDIT BY HAND.',
              'Built by Style Dictionary from tokens/tokens.json.',
              'Change the tokens there, then run: npm run tokens',
            ],
          },
        },
      ],
    },
  },
};

export default config;
