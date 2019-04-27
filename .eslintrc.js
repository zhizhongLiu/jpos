module.exports = {
  env: {
    'browser': true,
    'commonjs': true,
    'es6': true
  },
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    'sourceType': 'module'
  },
  globals: {
    'Vue': false,
    'weex': false,
    document: false,
    navigator: false,
    location: false,
  },
  // extends: ['weex'],
  plugins: [
    'html'
  ],
  rules: {
    // 禁用 console （console.warn console.error 可用）
    // 'no-console': ['warn', { allow: ['warn', 'error'] }],

    // 不能有空的大括号
    // 'no-empty': ['warn', { 'allowEmptyCatch': true }],

    // 不存在没有用到的变量
    'no-unused-vars': ['warn', {
      'vars': 'local',
      'caughtErrors': 'none',
      'args': 'none'
    }],

    // 数组中不能有额外的逗号（结尾可以有逗号）
    'no-sparse-arrays': 'error',

    // 在普通字符串中不能用模板字符串的语法
    'no-template-curly-in-string': 'warn',

    // 不能有执行不到的代码
    // 'no-unreachable': 'warn',

    // 存在 if(true) 或者 if(false)
    'no-constant-condition': 'warn',

    // 不可以有重复的值
    // 'no-dupe-args': 'warn',
    // 'no-dupe-keys': 'warn',
    // 'no-ex-assign': 'error',
    // 'no-func-assign': 'error',

    // 不可以有相同的 case 语句
    'no-duplicate-case': 'warn',

    // 禁止自己和自己比较或赋值
    // 'no-self-compare': 'warn',
    // 'no-self-assign': 'warn',

    // 不能有额外的 fn.bind
    // 'no-extra-bind': 'warn',

    // 不能有无用的 fn.call 和 fn.apply
    // 'no-useless-call': 'warn',

    // map reduce find every some filter sort 中的回调函数必须有返回值
    // 'array-callback-return': 'warn',




    // =========================================================
    //  禁用危险语法
    // =========================================================

    // 禁用 alert / debugger / caller / callee
    "no-alert": "error",
    "no-debugger": "error",
    "no-caller": "error",

    // 禁用 void / with / label
    // "no-void": "warn",
    "no-with": "warn",
    "no-labels": "error",

    // 禁止使用 new Function 或者 eval
    // "no-new-func": "warn",
    // "no-implied-eval": "warn",

    // 禁用多行字符串
    // "no-multi-str": "error",

    // 使用严格比较
    // eqeqeq: "warn",


    // =========================================================
    //  禁用全局变量
    // =========================================================

    // 禁止覆盖全局变量
    "no-global-assign": ["error"],

    // 不可隐式创建全局变量
    "no-implicit-globals": "error",

    // 禁用 window 和 global 变量
    "no-restricted-globals": ["error", "window", "global"],


    // =========================================================
    //  禁止修改原生对象
    // =========================================================

    // 禁止扩展原生对象
    // "no-extend-native": ["error"],

    // 不能通过实例调用 Object.prototype 中的方法
    // "no-prototype-builtins": "error",

    // 禁用 __iterator__ 和 __proto__ 属性
    "no-iterator": "error",
    "no-proto": "error",

    // 禁止使用 new 创建内置对象
    "no-new-wrappers": "warn",

    // 不能直接调用 Math() JSON()
    // "no-obj-calls": "error",

    // 必须使用 isNaN 判断 NaN
    "use-isnan": "error",


    // =========================================================
    //  限制变量名和作用域
    // =========================================================

    // 不能与父作用域中的变量重名
    // "no-shadow": ["error", {
    //   "builtinGlobals": false,
    //   "allow": ["module", "exports"]
    // }],

    // 禁止使用变量提升的特性
    // "no-use-before-define": "error",
    // "block-scoped-var": "error",

    // 禁止变量重复声明
    "no-redeclare": ["error", { "builtinGlobals": true }],

    // 禁止使用限制的（保留字）变量名
    "no-shadow-restricted-names": "error",

    // 禁止在 if 和 for 语句中创建函数
    "no-inner-declarations": "error",
    "no-loop-func": "error",

    // 限制不稳定的否定判断，优先级模糊
    // "no-unsafe-negation": "error",

    // 不能在 return 和 if 的判断语句中赋值
    // "no-return-assign": "error",
    // "no-cond-assign": "error",






    // no-var
    // 'no-var': 'error',

    // 要求或禁止 var 声明中的初始化
    "init-declarations": 2,

    // 强制使用单引号
    // 'quotes': ['error', 'single'],

    // 要求或禁止使用分号而不是 ASI
    // 'semi': ['error', 'never'],

    // 禁止不必要的分号
    // 'no-extra-semi': 'error',

    // 强制使用一致的换行风格
    'linebreak-style': ['error', 'unix'],

    // 空格2个
    // 'indent': ['error', 2, {'SwitchCase': 1}],

    // 指定数组的元素之间要以空格隔开(,后面)， never参数：[ 之前和 ] 之后不能带空格，always参数：[ 之前和 ] 之后必须带空格
    'array-bracket-spacing': [2, 'never'],

    // 在块级作用域外访问块内定义的变量是否报错提示
    'block-scoped-var': 0,

    // if while function 后面的{必须与if在同一行，java风格。
    'brace-style': [2, '1tbs', {'allowSingleLine': true}],

    // 双峰驼命名格式
    // 'camelcase': 2,

    // 数组和对象键值对最后一个逗号， never参数：不能带末尾的逗号, always参数：必须带末尾的逗号，
    // always-multiline：多行模式必须带逗号，单行模式不能带逗号
    // 'comma-dangle': [2, 'never'],

    // 控制逗号前后的空格
    // 'comma-spacing': [2, {'before': false, 'after': true}],

    // 控制逗号在行尾出现还是在行首出现
    // 'comma-style': [2, 'last'],

    // 圈复杂度
    // 'complexity': [2, 30],

    // 以方括号取对象属性时，[ 后面和 ] 前面是否需要空格, 可选参数 never, always
    'computed-property-spacing': [2, 'never'],

    // TODO 关闭 强制方法必须返回值，TypeScript强类型，不配置
    // 'consistent-return': 0

    "linebreak-style": [0, "windows"],
  }
}
