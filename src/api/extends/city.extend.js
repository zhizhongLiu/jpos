const stream = weex.requireModule('stream');
import source         from 'utils/source.util'

const http = (url) => new Promise((resolve, reject) => {
    let reqBody = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'GET',
        url: source.getJson(url),
        type: 'json',
        timeout: 10000
    };
    stream.fetch(reqBody, result => {
        if (result.status !== 200) return reject('网络繁忙，请稍后再试');
        resolve(result.data);
    });
});

export default {
    // 获取地区
    getCity () {
        return http('city.json');
    },
}
