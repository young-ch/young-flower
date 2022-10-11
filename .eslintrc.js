module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'no-unused-vars': 'off',
    'vue/valid-v-on' : 'off'
  }
}
// module.exports = {
//   root: true,
//   extends: [
//     '@indielayer/eslint-config-vue'
//   ]
// }
