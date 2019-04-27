const gesture = weex.requireModule('gesturePwdModule');

export default {
  set: (key) => new Promise((resolve, reject) => {
    gesture.setGesture(key, e => {
      e.code === '0000' ? resolve(e.data) : reject(e);
    });
  }).handle(),

  check: (key) => new Promise((resolve, reject) => {
    gesture.checkGesture(key, e => {
      e.code === '0000' ? resolve(e.data) : reject(e);
    });
  }).handle(),

  reset: (key) => new Promise((resolve, reject) => {
    gesture.resetGesture(key, e => {
      e.code === '0000' ? resolve(e.data) : reject(e);
    });
  }).handle(),

  edit: (key) => new Promise((resolve, reject) => {
    gesture.alterGesture(key, e => {
      e.code === '0000' ? resolve(e.data) : reject(e);
    });
  }).handle(),

  delete: (key) => new Promise((resolve, reject) => {
    gesture.deleteGesture(key, e => {
      e.code === '0000' ? resolve(e.data) : reject(e);
    });
  }).handle(),

  setImage: base64 => gesture.setImage(base64)
};