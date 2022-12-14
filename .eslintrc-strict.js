module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'react-app',
        'react-app/jest',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['tsconfig.json'],
    },
    plugins: ['@typescript-eslint'],
    root: true,
    rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-empty-function': 'off',
    },
};
