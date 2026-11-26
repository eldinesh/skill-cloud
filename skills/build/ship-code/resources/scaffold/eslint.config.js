import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'test-results', 'playwright-report'] },
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { 'jsx-a11y': jsxA11y, react, 'react-hooks': reactHooks },
    settings: { react: { version: '18.3' } },
    rules: {
      ...jsxA11y.flatConfigs.strict.rules,          // CODE-R19 / A11Y
      ...reactHooks.configs.recommended.rules,
      'react/no-danger': 'error',                    // CODE-R23
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      '@typescript-eslint/no-explicit-any': 'error', // CODE-R08
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/ban-ts-comment': ['error', { 'ts-expect-error': 'allow-with-description' }],
      'no-restricted-globals': ['error', 'fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource'], // CODE-R21
    },
  },
  {
    // CNT-R08: user-facing text lives in src/strings/, never inline in JSX
    files: ['src/routes/**/*.tsx', 'src/components/**/*.tsx'],
    rules: { 'react/jsx-no-literals': ['error', { noStrings: false, ignoreProps: true }] },
  },
  {
    files: ['tests/**/*.ts', 'scripts/**/*.mjs', '*.config.{ts,js}'],
    languageOptions: { globals: globals.node },
  },
);
