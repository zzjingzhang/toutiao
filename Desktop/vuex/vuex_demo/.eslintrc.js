module.exports = {
  root: true,
  env: {
    node: true,
    es6: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': 0,
    'no-multiple-empty-lines': 0,
    'indent': 0,
    'space-before-blocks': 0,
    "space-in-parens": ["error", "never"],
    "vue/return-in-computed-property": ["error", {
      "treatUndefinedAsUnspecified": true
    }]
  },

}
