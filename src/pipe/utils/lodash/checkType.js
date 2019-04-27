import getType from './getType';

/**
 * 校验类型
 * @param  {[type]} input [description]
 * @param  {[type]} check [description]
 * @return {[type]}       [description]
 */
export default (input, check) => getType(input) === check.toLowerCase();