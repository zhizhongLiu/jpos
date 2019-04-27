import checkType from './checkType';

export default input => {
  let output = {};
  if (checkType(input, 'object')) {
    for (let key in input) {
      if (input[key]) {
        output[key] = input[key];
      }
    }
  }
  return output;
};