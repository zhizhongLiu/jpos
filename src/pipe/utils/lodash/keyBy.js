import checkType from './checkType';

/**
 * array 按 key 重组成对象
 * var arr = [{name:"lisa",sex:"man"},{name:"lucy",sex:"wom"}]
 * keyBy(arr,'name') ==> {lisa:{name:"lisa",sex:"man"},lucy:{name:"lucy",sex:"wom"}}
 * @param  {[type]} array    [description]
 * @param  {[type]} key      [description]
 * @param  {Object} callBack [description]
 * @return {[type]}          [description]
 */
export default (array, key, callBack = {}) => {
  if (checkType(array, 'array')) {
    array.forEach(item => {
      callBack = {
        ...callBack,
        [item[key]]: item
      }
    })
  }
  return callBack;
};