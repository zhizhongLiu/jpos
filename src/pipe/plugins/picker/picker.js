const picker = weex.requireModule('picker');
const supPicker = weex.requireModule('jsonPickModule');

export default {
  pick: options => new Promise((resolve, reject) => {
    picker.pick(options, e => {
      e.result === 'success' ? resolve(e.data) : reject(e.result);
    });
  }).handle(),

    pickDate: options => new Promise((resolve, reject) => {
        picker.pickDate(options, e => {
            e.result === 'success' ? resolve(e.data) : reject(e.result);
        });
    }).handle(),

  picks: options => new Promise((resolve, reject) => {
    supPicker.show(options, e => {
      e.code === '0000' ? resolve(e.data) : reject(e);
    });
  }).handle(),
};