import tseslint from 'typescript-eslint'

export default tseslint.config(
    {
        ignores: [
            '**/node_modules/**',
            '**/build/**',
            '**/example-node-modules/**',
            'coverage/**',
            'docs/**'
        ]
    },
    ...tseslint.configs.recommendedTypeChecked.map((config) => (
        config.files ? config : { ...config, files: ['**/*.ts'] }
    )),
    {
        files: ['**/*.ts'],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname
            }
        },
        rules: {
            '@typescript-eslint/no-extraneous-class': 'off',
            '@typescript-eslint/require-await': 'off',
            '@typescript-eslint/strict-boolean-expressions': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/unbound-method': 'off',
            'prefer-rest-params': 'off',
            'prefer-spread': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'none',
                    caughtErrors: 'none'
                }
            ]
        }
    }
)
