module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.json"
    },
    plugins: [
        "@typescript-eslint",
    ],
    extends: [
        "standard-with-typescript"
    ],
    rules: {
        "@typescript-eslint/no-extraneous-class": "off",
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/strict-boolean-expressions": "off"
    }
}
