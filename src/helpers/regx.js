export default {
  // 手机号
  isPhone: value => /^1\d{10}$/.test(value),
  // 身份证
  isIDCard: value => /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)$/.test(value),
  // 银行卡
  isBankCard: value => /^\d{1,20}$/.test(value),
  // 邮箱
  isEmail: value => /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value),

  isMoney: value => /^([1-9]\d{0,9}|0)([.]?|(\.\d{1,2})?)$/.test(value),

  //刷卡器SN号
  isSN: value => /^([0-9a-zA-Z]{15}|[0-9a-zA-Z]{16}|[0-9a-zA-Z]{20})$/.test(value),

  //刷卡器PN号
  isPN: value => /^([0-9a-zA-Z]{16}|[0-9a-zA-Z]{20})$/.test(value)
};