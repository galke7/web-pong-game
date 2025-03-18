module.exports = {
  env: {
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  extends: ['eslint:recommended'],
  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',
    'no-undef': 'error',
    'no-unused-vars': 'warn',
    'no-use-before-define': 'warn',
  },
};
