const clipboard = weex.requireModule('clipboard');

export default {
  paste: () => new Promise((resolve, reject) => {
    clipboard.getString(e => {
      e.result === 'success' ? resolve(e.data) : reject(e);
    });
  }).handle(),

  copy: $string => clipboard.setString($string)
};