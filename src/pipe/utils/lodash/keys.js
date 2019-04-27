import checkType from './checkType';

/**
 * 获取对象所有的key
 * @param  {[type]} input [description]
 * @return {[type]}       [description]
 */
export default input => {
  let keys = [];
  if (checkType(input, 'object')) {
    for (let key in input) {
      keys.push(key);
    };
  };
  return keys;
};