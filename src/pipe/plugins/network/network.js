const netWork = weex.requireModule('netWorkModule');

export default {
  get: () => new Promise((resolve, reject) => {
    netWork.getStatus(e => {
      e.code === '0000' ? resolve(e.data) : reject(e);
    });
  }).handle()
};