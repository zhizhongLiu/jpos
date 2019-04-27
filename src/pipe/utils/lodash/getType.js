/**
 * 获取数据类型
 * @param  {[type]} input [description]
 * @return {[type]}       [array string bbject number undefined null boolean]
 */
export default input => Object.prototype.toString.call(input).toLowerCase().match(/\s\w+/)[0].trim();