const createConfig = (api) => {
  api.cache.never();
  return {
    presets: [
      '@babel/preset-react',
      [
        '@babel/env',
        {
          modules: false,
          loose: true,
          useBuiltIns: false,
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
    plugins: ['@babel/syntax-dynamic-import'],
  };
};

module.exports = createConfig;
