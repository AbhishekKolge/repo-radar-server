import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginImport from 'eslint-plugin-import';

export default [
  eslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: eslintPluginPrettier,
      import: eslintPluginImport,
    },
    rules: {
      ...tseslint.configs['recommended'].rules,
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      'no-console': 'warn',
      'no-debugger': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'consistent-return': 'warn',
      'no-duplicate-imports': 'warn',
      eqeqeq: 'warn',
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/no-duplicates': 'warn',
      'import/order': ['warn', { 'newlines-between': 'never', alphabetize: { order: 'asc' } }],
      'no-return-await': 'warn',
      'require-await': 'warn',
      'prettier/prettier': 'error',
      'no-undef': 'off',
      'no-shadow': 'warn',
    },
  },
  {
    files: ['src/domain/graphql/types.ts'],
    rules: {
      'no-unused-vars': 'off',
      'no-console': 'off',
      'no-debugger': 'off',
      'prefer-const': 'off',
      'consistent-return': 'off',
      'no-duplicate-imports': 'off',
      eqeqeq: 'off',
      'import/no-unresolved': 'off',
      'import/named': 'off',
      'import/default': 'off',
      'import/no-duplicates': 'off',
      'import/order': 'off',
      'no-return-await': 'off',
      'require-await': 'off',
      'prettier/prettier': 'off',
      'no-undef': 'off',
      'no-shadow': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
  {
    files: ['src/**/*.graphql'],
    rules: {
      'no-undef': 'off',
    },
  },
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/*.d.ts'],
  },
  {
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
  },
];
