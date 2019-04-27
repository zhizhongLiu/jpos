
export function d2(array, length) {
  var __array = [];

  for (var i = 0; i < array.length; i++) {
    var x = Math.floor(i / length);
    if (!__array[x]) {
      __array[x] = [];
    };
    __array[x].push(array[i]);
  };

  var endless = __array[__array.length - 1];
  var fill = length - endless.length;

  for (var j = 0; j < fill; j++) {
    endless.push({})
  };

  return __array;
};