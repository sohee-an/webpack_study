// eslint.config.js
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/.next/**'],
  },
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules,         // 기본 JS 룰
      ...tseslint.configs.recommended.rules,    // 타입스크립트용 룰
      'prettier/prettier': 'error',              // ⚡️ prettier 위반은 error로 (warn 말고!)
      semi: ['error', 'always'],                 // 세미콜론 강제
      ...prettierConfig.rules,                   // ⭐️ 마지막에 prettier 룰로 덮어쓰기
    },
  },
];
