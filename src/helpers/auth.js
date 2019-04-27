import store from 'utils/store';
import pick from 'utils/lodash/pick';
import filterEmpty from 'utils/lodash/filterEmpty';
const _TOKEN_ = '_TOKEN_';

const keys = [
    'address',
    'addressDetail',
    'guarantee',
    'idCardNo',
    'merchant_id',
    'open',
    'phoneNo',
    'photoUrl',
    'realName',
    'recruit',
    'sex',
    'total_profit',
    'week_profit',
    'token',
    'arr_role_auth',
    'cpos',
    'jfbpos'
];

export default {
  login: info => store.set(_TOKEN_, pick(info, keys)).catch(error => { throw '登录失败'; }),

  update: (input) => {
    input = pick(filterEmpty(input), keys);
    return store.get(_TOKEN_).then(info => store.set(_TOKEN_, Object.assign(info, input)));
  },

  getToken: () => store.get(_TOKEN_).catch(error => { throw '用户未登录'; }),

  logout: () => store.remove(_TOKEN_).catch(error => { throw '缓存清除失败'; }),
};
