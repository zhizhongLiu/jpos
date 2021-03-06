const transition = weex.requireModule('transitionModule');
import path from '../path/path';
import Defer from '../../utils/defer';

const defer = new Defer(1000);

export default {
  show: pagename => new Promise((resolve, reject) => {
    if (!defer.do(pagename)) return null; // 过滤连续点击

    path.page(pagename).then(nativepath => {
      transition.present({ url: nativepath, animated : 'true' }, e => {
        // e.code === '0000' ? resolve(e.data) : reject(e);
        resolve();
      });
    });
  }).handle(),

  close: () => new Promise((resolve, reject) => {
    transition.dismiss({}, e => {
      // e.code === '0000' ? resolve(e.data) : reject(e);
      resolve();
    });
  }).handle(),
};