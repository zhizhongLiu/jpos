import checkType from './checkType';

/**
 * 是否存在
 * @param  {[type]} collection [description]
 * @param  {[type]} input      [description]
 * @return {[type]}            [description]
 */
export default (collection, input) => {
  let output = false;
  if (checkType(collection, 'array') || checkType(collection, 'string')) {
    if (collection.indexOf(input) != -1) {
      output = true;
    }
  } else if (checkType(collection, 'object')) {
    for (let key in collection) {
      if (collection[key] === input) {
        output = true;
      }
    }
  }
  return output;
};