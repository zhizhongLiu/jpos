const loadResurce = weex.requireModule('loadResurceModule');
import isString from '../../utils/lodash/isString';
import isArray from '../../utils/lodash/isArray';
import dialogs from '../dialogs/dialogs';
/**
 * path模块 内部消化业务异常
 */
export default {
  page: argument => {
    if (isString(argument)) {
      return getPagePath(argument).handle().catch(function (error) {
        dialogs.toast({ message: error });
      });
    }
    if (isArray(argument)) {
      var promises = [];
      argument.forEach(arg => promises.push(getPagePath(arg)));
      return Promise.all(promises).handle().catch(function (error) {
        dialogs.toast({ message: error });
      });
    }
  },

  source: string => new Promise((resolve, reject) => {
    loadResurce.getUrlPath(string, e => {
      e.code === '0000' ? resolve(e.data) : reject(e);
    });
  }).handle().catch(function (error) {
    dialogs.toast({ message: error });
  }),
};

const getPagePath = string => new Promise((resolve, reject) => {
  const pagename = string.substr(string.lastIndexOf("/") + 1).split(".")[0];
  loadResurce.getRoutePath(pagename, e => {
    e.code === '0000' ? resolve(e.data) : reject(e);
  });
});
