import checkType from './checkType';

/**
 * 获取数组里所有包含key的值
 * @param  {[type]} input [description]
 * @param  {[type]} key   [description]
 * @return {[type]}       [description]
 */
export default (input, key) => {
  let output = [];
  if (checkType(input, 'array') && checkType(key, 'string')) {
    input.forEach(item => {
      item[key] && output.push(item[key]);
    })
  }
  return output;
};
