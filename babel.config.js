const createConfig = (api) => {
  api.cache.never();
  return {
    presets: [
      [
        '@babel/env',
        {
          modules: false,
          loose: true,
          useBuiltIns: false,
        },
      ],
    ],
    plugins: [
      ['@babel/plugin-transform-react-jsx', {pragma: 'h'}],
      '@babel/syntax-dynamic-import',
    ],
    env: {
      web: {
        presets: [
          [
            '@babel/env',
            {
              targets: {
                browsers: [
                  'last 2 Chrome versions',
                  'last 2 Firefox versions',
                  'last 1 Safari versions',
                  'last 1 ChromeAndroid versions',
                  'last 1 Edge versions',
                ],
              },
            },
          ],
        ],
      },
    },
  };
};

module.exports = createConfig;
