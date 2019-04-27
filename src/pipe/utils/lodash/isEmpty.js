import checkType from './checkType';

/**
 * 判断对象是否为空
 * true: {},[],bool,"",null,undefined
 * false: {a:1},[1],"1"
 * @param  {[type]} input [description]
 * @return {[type]}       [description]
 */
export default input => {
  if (checkType(input, 'string') || checkType(input, 'array')) {
    return input.length === 0;
  }
  if (checkType(input, 'object')) {
    for (let key in input) {
      if (hasOwnProperty.call(input, key)) {
        return false;
      }
    }
  }
  return true;
};