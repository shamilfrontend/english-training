module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-cycle': 'off',
    'vue/multi-word-component-names': 'off',
    'max-len': ['error', { code: 120, ignoreUrls: true, ignoreStrings: true }],
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state', // для Pinia
        'acc', // для reduce аккумулятора
        'e', // для e.returnvalue
      ],
    }],
    'import/prefer-default-export': 'off',
    'no-shadow': ['error', { allow: ['state', 'getters', 'actions'] }],
    'no-underscore-dangle': 'off',
    'no-void': 'off',
    'no-await-in-loop': 'off',
    'no-restricted-syntax': 'off',
    'vue/no-v-html': 'off',
    'vue/component-tags-order': ['error', {
      order: ['script', 'template', 'style'],
    }],
  },
};
