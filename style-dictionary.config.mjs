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

StyleDictionary.registerTransformGroup({
  name: 'css/tokens',
  transforms: ['name/pathVerbatim', 'color/css', 'fontFamily/css', 'size/px'],
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
