
import Store                from 'utils/store'
import auth                 from 'helpers/auth';
// import Toast                from 'helpers/toast'

const $common_merchant_KEY$ = '$common_merchant_KEY$';

export default {
    // 取出
    get (key) {
        return new Promise((resolve, reject) => {
            auth.getToken().then((info) => {
                return Store.get(`${info.phoneNo}_${$common_merchant_KEY$}`).then((arr) => {
                    // Toast(arr)
                    if (!key) return resolve(arr);
                    let result = {};
                    arr.forEach((item) => {
                        if (item.key === key) return result = item;
                    });
                    resolve(result);
                }).catch(() => {
                    return key ? resolve({}) : resolve([]);
                });
            }).catch(() => {
                reject('请先登录');
            });
        });
    },

    // 存储
    save (obj) {
        return new Promise((resolve, reject) => {
            auth.getToken().then((info) => {
                let is_arr = Object.prototype.toString.call(obj) === '[object Array]';
                if (is_arr) {
                    Store.set(`${info.phoneNo}_${$common_merchant_KEY$}`, obj).then(() => {
                        resolve(obj);
                    }).catch(() => {
                        reject('存储失败');
                    })
                } else {
                    this.get().then((arr) => {
                        let index = null;
                        let item = {};
                        arr.forEach((it, i) => {
                            if (it.key === obj.key) {
                                item = it;
                                return index = i;
                            }
                        });
                        // console.log('重复index =>', index);
                        obj.time = new Date().getTime();
                        if (index === null) {
                            obj.key = obj.time;
                        } else {
                            arr.splice(index, 1);
                        }
                        let new_obj = {
                            ...item,
                            ...obj,
                        };
                        arr.unshift(new_obj);
                        Store.set(`${info.phoneNo}_${$common_merchant_KEY$}`, arr).then(() => {
                            resolve(new_obj);
                        }).catch(() => {
                            reject('存储失败');
                        })
                    })
                }
            }).catch(() => {
                reject('请先登录');
            });
        });
    },

    // 删除
    remove (key) {
        return new Promise((resolve, reject) => {
            auth.getToken().then((info) => {
                if (!key) return Store.remove(`${info.phoneNo}_${$common_merchant_KEY$}`);
                // return new Promise((resolve, reject) => {
                    this.get().then((arr) => {
                        let index = null;
                        arr.forEach((item, i) => {
                            if (item.key === key) return index = i;
                        });
                        if (index !== null) arr.splice(index, 1);
                        return this.save(arr);
                    }).then((result) => {
                        resolve(result);
                    }).catch((err) => {
                        reject('删除失败');
                    // })
                })
            }).catch((error) => {
                console.log('error', error);
                reject('请先登录');
            });
        });
    }
}
