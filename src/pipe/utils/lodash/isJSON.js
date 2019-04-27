import checkType from './checkType';

/**
 * 判断是否是json
 * @param  {[type]} input [description]
 * @return {[type]}       [description]
 */
export default input => checkType(input, 'object');