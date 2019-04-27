const qrcode = weex.requireModule('qrCodeModule');

export default {
  scan: () => new Promise((resolve, reject) => {
    qrcode.scan(e => {
      e.code === '0000' ? resolve(e.data) : reject(e);
    });
  }).handle(),

  create: options => new Promise((resolve, reject) => {
    qrcode.createqr(options, e => {
      e.code === '0000' ? resolve(e.data) : reject(e);
    });
  }).handle(),

  analysis: () => new Promise((resolve, reject) => {
    qrcode.analysisqr(e => {
      e.code === '0000' ? resolve(e.data) : reject(e);
    });
  }).handle(),
};
