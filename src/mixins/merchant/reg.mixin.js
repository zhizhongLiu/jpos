import WowView                  from 'wow-weex/lib/wow-view'
import WowInputCell             from 'wow-weex/lib/wow-input-cell'
import WowTextArea              from 'wow-weex/lib/wow-text-area'
import WowButton                from 'wow-weex/lib/wow-button'
import ArrowTip                 from 'components/merchant/arrow-tip'
import ImageUpload              from 'components/merchant/image-upload'
import DataUtil                 from 'utils/data.util'
import EntryUtil                from 'utils/entry.util'
import _                        from 'utils/lodash/lodash'
import Source                   from 'utils/source.util'
import Store                    from 'utils/store'
import Toast                    from 'helpers/toast'
import Loading                  from 'plugins/loading'
import Dialogs                  from 'plugins/dialogs'
import Router                   from 'plugins/router'

const data = () => {
    return {
        store_data: false,
        rightSrc: Source('sp_xq2.png'),
        params: '',
        mer_view_remark: ''     // 审核未通过原因
    }
};

const computed = {
    computedButton (callback) {
        let options = {
            ...this.obj_input,
            ...this.obj_hidden,
            ...this.obj_image,
        };
        return DataUtil.checkAble(options);
        // return false;
    },
    // 右上角文字
    computedRightTxt() {
        if (this.params.key) {
            return '保存';
        } else if (this.params.mbl && !this.params.type ) {
            return '审批意见';
        } else if (this.params.type ) {
            return '';
        } else {
            return '保存';
        }
    }
};
const methods = {
    // 获取页面传递参数
    fetchPageParams() {
        this.params = Router.getParams(this) || {};
        console.log('获取页面传递参数', this.params);
    },
    // 获取未提交数据
    fetchStoreData (callback) {
        if (!this.params.key) return null;
        Loading.show();
        EntryUtil.get(this.params.key).then(result => {
            console.log('待提交-----------详情数据',result);
            this.obj_input && DataUtil.assignmentData(result, this.obj_input);
            this.obj_hidden && DataUtil.assignmentData(result, this.obj_hidden);
            this.obj_image && DataUtil.assignmentData(result, this.obj_image);

            callback && callback(result);
        }).catch((err) => {
            console.log('err', err)
            Toast('没有找到对应的值');
        }).finally(() => {
            Loading.hide();
        });
    },
    // 获取已提交详情存储数据
    fetchStoreDerails(callback) {
        if (!this.params.mbl) return null;
        Loading.show();
        Store.get('merc_details').then((result) => {
            console.log('已提交--------详情数据', result);
            this.mer_view_remark = result.merViewRemark;
            this.obj_input && DataUtil.assignmentData(result, this.obj_input);
            this.obj_hidden && DataUtil.assignmentData(result, this.obj_hidden);
            this.obj_image && DataUtil.assignmentData(result, this.obj_image);

            callback && callback(result);
        }).catch((err)=>{
            console.log('err', err);
        }).finally(() => {
            Loading.hide();
        });
    },
    // 保存点击事件
    handleRight(callback) {
        if (this.params.mbl) {
            Dialogs.alert({
                message: this.mer_view_remark,
                okTitle: '知道了',
            })
        } else {
            this.saveData(true, callback);
        }
    },
    // 保存数据
    saveData(type = true, callback) {
        return new Promise((resolve, reject) => {
            // console.log('callback', callback);
            // callback && callback();
            Loading.show();
            let data = DataUtil.filterData({
                ...this.obj_input,
                ...this.obj_image,
                ...this.obj_hidden,
            });
            // console.log(data);
            data.key = this.params.key;
            EntryUtil.save(data).then((result) => {
                this.params.key = result.key;
                type && Toast('保存成功');
                resolve();
            }).catch(() => {
                type && Toast('保存失败');
                reject();
            }).finally(() => {
                Loading.hide();
            });
        })
    },
    // 重新提交保存
    saveDetail() {
        return new Promise((resolve, reject) => {
            Loading.show();
            let data = DataUtil.filterData({
                ...this.obj_input,
                ...this.obj_image,
                ...this.obj_hidden,
            });
            Store.get('merc_details').then(res => {
                res = _.isObject(res) ? res : {};
                data = Object.assign(res, data);
                Store.set('merc_details', data).then(() => {
                    resolve();
                }).catch(() => {
                    reject('存储失败');
                })
            });
        })
    },
    utf16toEntities (str) {
        let patt = /[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则
        str = str.replace(patt, function (char) {
            let H = '', L = '', code = '';
            if (char.length === 2) {
                H = char.charCodeAt(0); // 取出高位
                L = char.charCodeAt(1); // 取出低位
                code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法
                return "&#" + code + ";";
            } else {
                return char;
            }
        });
        return str;
    },
    // 跳转页面
    handleJump (page, data = {}) {
        Router.push(page, data)
    },
    forEach (obj, callback) {
        for(let key in obj){
            callback && callback(obj[key], key);
        }
    },
};

const components = {
    WowView,
    WowInputCell,
    ArrowTip,
    WowTextArea,
    WowButton,
    ImageUpload,
};

export default {
    data,
    components,
    methods,
    computed
}
