const jfProtocolModule = weex.requireModule('jfProtocolModule') || {};

export default {
    openProtocol: options => new Promise((resolve, reject) => {
        if (!jfProtocolModule.openProtocol)
            return reject('请下载最新APP');
        jfProtocolModule.openProtocol(options, e => {
            e.code === '0000' ? resolve(e.data) : reject(e);
        });
    }).handle(),
};
