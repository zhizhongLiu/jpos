const modal = weex.requireModule('modal');
import Defer from '../../utils/defer/defer';
import isEmpty from '../../utils/lodash/isEmpty';

const defer = new Defer(2000);

export default {
  toast: options => {
    if (!defer.do(options.message)) return null;
    if (isEmpty(options.message)) return null;
    options.duration = options.duration || 2;
    modal.toast(options);
  },

  alert: (options, callback) => {
    modal.alert(options, callback);
  },

  confirm: (options, callback) => {
    modal.confirm(options, callback);
  },

  prompt: (options, callback) => {
    modal.prompt(options, callback);
  },
};