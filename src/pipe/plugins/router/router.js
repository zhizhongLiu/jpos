const navigator = weex.requireModule('navigator');
const manager = weex.requireModule('pageManagerModule');
const external = weex.requireModule('externalAppModule');
import pick from 'utils/lodash/pick';
import isString from 'utils/lodash/isString';

import path from '../path/path';
import loading from '../loading/loading';
// import dialogs from '../dialogs/dialogs';
import Defer from '../../utils/defer';

const encode = input => '?parmas=' + encodeURIComponent(JSON.stringify(input));
const decode = input => {
    const objstr = input.substr(input.indexOf("?parmas=") + 8);
    return objstr ? JSON.parse(decodeURIComponent(decodeURIComponent(objstr))) : '';
};

const defer = new Defer(1000);

export default {
    push: (input, parmas) => {
        if (!defer.do(input + JSON.stringify(parmas))) return null; // 过滤连续点击

        let options = pick(input, ['url', 'animated', 'close']);
        let pagename = isString(input) ? input : options.url;

        loading.show();

        path.page(pagename)
            .then(nativepath => {
                nativepath = parmas ? nativepath + encode(parmas) : nativepath;
                navigator.push({
                    url: nativepath,
                    animated: options.animated || 'true',
                    close: options.close
                }, () => {});
            })
            .catch(error => dialogs.toast({ message: error }))
            .finally(() => loading.hide());
    },

    pop: (animated = 'true') => navigator.pop({ animated: animated }, () => {}),

    root: () => manager.popToRootPage(() => {}),

    getParmas: weex => decode(weex.$getConfig().bundleUrl),

    getParams: weex => {
        var bundleUrl = weex.$getConfig().bundleUrl,
            params = bundleUrl.indexOf('?parmas=') > -1 ? bundleUrl.substr(bundleUrl.indexOf("?parmas=") + 8) : '';
        return params ? JSON.parse(decodeURIComponent(decodeURIComponent(params))) : '';
    },
    del: (back_index = 1, front_index = '') => {
        manager.deletePageWithParam({popBack: back_index + '', popFront: front_index + ''}, e => {})
    },
    external: options => external.open(options)
};
