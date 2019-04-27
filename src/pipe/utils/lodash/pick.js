import checkType from './checkType';

/**
 * 按key值获取对象
 * @param  {[type]} input [description]
 * @param  {[type]} keys  [description]
 * @return {[type]}       [description]
 */
export default (input, keys) => {
  input = checkType(input, 'object') ? input : {};
  keys = checkType(keys, 'array') ? keys : [];

  let output = {};
  for (let key in input) {
    if (keys.indexOf(key) !== -1) {
      output[key] = input[key];
    }
  }
  return output;
};