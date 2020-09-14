module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    'linebreak-style': ['off', 'windows'],
    "max-len": 0, //一行最大長度，單位為字元
    "no-undef": 0, // 可以 有未定義的變數
    "no-plusplus": 0, //不允許使用++ --運算子
    "default-case": 0, //在switch語句中需要有default語句
  },
};
