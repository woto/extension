module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/jsx-runtime',
    'airbnb',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'react-hooks',
  ],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn', // <--- THIS IS THE NEW RULE
    // MY RULES
    'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],
    'react/destructuring-assignment': [0, 'always', { ignoreClassFields: true, destructureInSignature: 'ignore' }],
  },
  globals: {
    // React: true,
    // google: true,
    // mount: true,
    // mountWithRouter: true,
    // shallow: true,
    // shallowWithRouter: true,
    // context: true,
    // expect: true,
    // jsdom: true,
    JSX: true,
  },
};
