const stream = weex.requireModule('stream');
const jfhttps = weex.requireModule('jfHttpsModule');
import config from 'config/env.config'
import auth from './auth';
import jf from './jfservice';
import loading from 'plugins/loading';
import modal from 'plugins/modal';
import toast from 'helpers/toast';

export default function (api, options) {
    options.loading ? loading.show() : null;
    return new Request(api, options).finally(() => {
        options.loading ? loading.hide() : null;
    });
};

function Request(api, options) {
    options = options || {};
    this.method = options.method || 'GET';
    this.body = options.body || {};
    this.headers = options.headers || {};
    this.api = api;
    this.http = options.http || false;
    // const requestType = this.http ? '_http' : '_fetch';

    const requestType = this.http === 'new' ?
                        '_new' : this.http ?
                        '_http' : '_fetch';
    // console.log('requestType', requestType)
    return this[requestType]();
};

Request.prototype._http = function() {
    const method = this.method.toLocaleLowerCase();
    const apiUrl = config.API_URL + this.api;
    return new Promise((resolve, reject) => {
        console.log(apiUrl + '_请求的数据：',this.body);
        jfhttps[method](apiUrl, this.body, function (e) {
            console.log(apiUrl + '_返回的数据：', e);
            // if (e.code !== '0000') return reject('请求失败');
            if (e.code === '0001' || e.code === '0002') {
                reject(e.data.respDesc);
                auth.logout().finally(() => modal.show('dtb_user_login'));
            } else if (e.code === '0000') {
                resolve(e.data);
            } else {
                toast(e.data);
                reject(e.data);
            }
        });
    });
};

Request.prototype._fetch = function() {
    return jf.md5({req: JSON.stringify(this.body)}).then(md5 => {
        const method = this.method.toLocaleUpperCase();
        const apiUrl = config.API_URL + this.api;

        let reqBody = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: method,
            url: apiUrl,
            type: 'text',
            timeout: 60000
        };
        console.log(this.api + '_请求的数据：',this.body);
        if (method == 'GET') {
            reqBody.url = reqBody.url + '?req=' + md5.req + '&sign=' + md5.sign + '&ts=' + md5.ts;
            // console.log(this.api + '_请求的数据：',reqBody.url);
        } else if (method == 'POST') {
            reqBody.body = 'req=' + md5.req + '&sign=' + md5.sign + '&ts=' + md5.ts;
            // console.log(this.api + '_请求的数据：',reqBody.body);
        }
        return new Promise((resolve, reject) => {
            stream.fetch(reqBody, result => {
                // console.log(this.api + '_返回的数据：',result);
                // toast('ee'+JSON.stringify(result));
                /**连接超时*/
                if (result.statusText === 'ERR_CONNECT_FAILED' || result.status === -1) {
                    toast('连接超时，请稍后再试');
                    return reject();
                }
                if (result.status !== 200) { return reject('请求失败'); }
                let decode = decodeURIComponent(result.data);
                const index = decode.indexOf('\{');
                const lastIndex = decode.lastIndexOf('\}');
                decode = decode.substr(index, lastIndex - index + 1);
                const respData = JSON.parse(decode);
                console.log(this.api + '_返回的数据：',respData);
                if (respData.code === '0001' || respData.code === '0002') {
                    // reject(respData.msg);
                    reject('请重新登陆');
                    auth.logout().finally(() => modal.show('dtb_user_login'));
                } else {
                    resolve(respData);
                }
            });
        });
    });
};

Request.prototype._new = function() {
    const method = this.method.toLocaleLowerCase();
    const apiUrl = config.NEW_API_URL + this.api;
    this.body.appUser = 'dtb_mpos';
    this.body.signkey = '36f9c59d46ad450f84c47f81e10b429c';
    this.body.version = '3.7.4';
    // const environment = {
    //     appUser: 'dtb_mpos',
    //     signkey: '36f9c59d46ad450f84c47f81e10b429c',
    //     version: '3.7.4'
    //   };
    // this.body = Object.assign(this.body, environment);
    return new Promise((resolve, reject) => {
        console.log(apiUrl + '_请求的数据：',this.body);
        jfhttps[method](apiUrl, this.body, function (e) {
            console.log(apiUrl + '_返回的数据：', e);
            // if (e.code !== '0000') return reject('请求失败');
            if (e.code === '0001' || e.code === '0002') {
                console.log(111);
                reject(e.data.respDesc);
                auth.logout().finally(() => modal.show('dtb_user_login'));
            } else if (e.code === '0000') {
                console.log(222);
                resolve(e.data);
            } else {
                console.log(333);
                toast(e.data);
                reject(e.data);
            }
        });
    });

};
