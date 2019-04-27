<template>
    <wow-view
            :view_header_right_txt="computedRightTxt"
            :view_header_right_color="params.mbl ? '#5A5D62':'#F76B1C'"
            @rightItemClick="handleRight"
            :view_header_right_src="params.mbl && !params.type ? rightSrc: ''"
            view_header_center_txt="基本信息">
        <template v-for="(item, key) in obj_input">
            <div>
                <wow-input-cell
                    v-if="key !== 'mercRegAddr' && item.visible !== false"
                    class="cell-item"
                    @click="handleSelect(item, key, item.label)"
                    :class="[item.is_margin && 'margin']"
                    :input_value="item.value"
                    :input_max_length="item.max_length"
                    :input_placeholder="item.placeholder"
                    :input_label_txt="item.label"
                    :input_type="item.type || 'text'"
                    :input_disabled="is_disabled || item.disabled"
                    :input_use="item.use_input !== false"
                    :input_use_right="item.use_input_right !== false"
                    :key="key"
                    @input="handleInput(item,key, $event)">
                    <div slot="input_other" class="send-code" :class="[num_count_down === num_default_count_down && 'send-code-color']" v-if="key === 'checkCode'">
                        <text class="send-code-text" v-if="num_count_down === num_default_count_down" @click="handSendCode">获取验证码</text>
                        <text class="send-code-text" v-if="num_count_down !== num_default_count_down">{{num_count_down}} s</text>
                    </div>
                    <arrow-tip slot="input_unit" v-if="item.use_arrow"></arrow-tip>
                    <div class="radio-box" slot="input_unit" v-if="item.use_radio && !is_disabled">
                        <div class="radio-item"
                             @click="handleRadio(item, radio_item, key)"
                             v-for="(radio_item, radio_index) in item.use_radio" :key="radio_index">
                            <image class="radio-image" :src="item.value === radio_item.value ? src_radio_checked : src_radio_normal"></image>
                            <text class="radio-text" :class="[item.value === radio_item.value && 'radio-text-color']">{{radio_item.text}}</text>
                        </div>
                    </div>
                </wow-input-cell>
            </div>
            <div>
                <div v-if="key === 'mercRegAddr'" class="text-area">
                    <text class="text-area-label">{{item.label}}</text>
                    <wow-text-area
                        :text_value="item.value"
                        @input="handleInput(item,key, $event)"
                        :text_max_lenght="item.max_length"
                        :text_placeholder="item.placeholder"
                        text_border_color="#fff">
                    </wow-text-area>
                </div>
            </div>
        </template>
        <div>
            <wow-input-cell
                @click="handleProtocol"
                v-if="!params.mbl && !obj_input.busRegNo.value"
                class="cell-item"
                input_label_txt="查看电子协议"
                input_use="">
                <arrow-tip slot="input_unit"></arrow-tip>
            </wow-input-cell>
        </div>
        <wow-button
                class="button"
                button_margin_top="80"
                :button_disabled="computedButton"
                @click="handleSubmit"
                button_txt="下一步">
        </wow-button>
        <!-- <text @click="handleRemove">删除存储的数据</text> -->
        <!-- <text :style="{marginTop: '100px', marginBottom: '100px'}" @click="handleRemove(params)">删除存储的数据</text> -->
    </wow-view>
</template>
<script>
    import WowView                  from 'wow-weex/lib/wow-view'
    import WowInputCell             from 'wow-weex/lib/wow-input-cell'
    import WowTextArea              from 'wow-weex/lib/wow-text-area'
    import WowButton                from 'wow-weex/lib/wow-button'
    import ArrowTip                 from 'components/merchant/arrow-tip'
    // import Router                   from 'plugins/router'
    import Source                   from 'utils/source.util'
    import DataUtil                 from 'utils/data.util'
    // import RegularUtil              from 'utils/regular.util'
    import EntryUtil                from 'utils/entry.util'
    // import Store                    from 'utils/store'
    // import _                        from 'utils/lodash/lodash'
    import Api                      from 'api/entry.api'
    import Toast                    from 'helpers/toast'
    import Loading                  from 'plugins/loading'
    import Picker                   from 'plugins/picker'
    import Channel                  from 'plugins/channel'
    import Dialogs                  from 'plugins/dialogs'
    import Auth                     from 'helpers/auth'
    import Jf                       from 'helpers/jfservice'
    import BaseMixin                from 'mixins/merchant/base.mixin'
    import RegMixin                 from 'mixins/merchant/reg.mixin'
    import Protocol                 from 'plugins/protocol'

    const $$SELECT_MCC = '$$SELECT_MCC';

    export default {
        mixins: [ BaseMixin, RegMixin],
        data () {
            return {
                is_disabled: false,
                num_count_down: 30,
                num_default_count_down: 30,
                src_radio_checked: Source('dtb_radio01_checked.png'),
                src_radio_normal: Source('dtb_radio01_normal.png'),
                rightSrc: Source('sp_xq2.png'),

                use_protocol: false,
            }
        },
        created () {
            // 获取参数
            this.fetchPageParams();
            // 获取详情中存储的数据
            this.fetchStoreData(this.StoreDataCall);
            // 获取详情存储的数据
            this.fetchStoreDerails(this.StoreDerailsCall);
            // 监听事件
            this.monitorEvent();
            // 判断业务员权限，开通
            // this.judgeUserAuth();
        },
        methods: {
            handleProtocol () {
                let {
                    mercCnm,
                    mercRegAddr,
                } = this.obj_input;
                let options = {
                    mercCnm,
                    mercRegAddr,
                };
                if (DataUtil.checkData(options))
                    return true;
                options = DataUtil.filterData(options);
                let arr = '';
                Protocol.openProtocol(options).then((res) => {
                    arr = res;
                    return this.uploadImage(arr[0]);
                }).then((res) => {
                    let { code, msg, data} = res;
                    if (code !== '0000')
                        throw msg;
                    this.obj_hidden.receiptProImg1.value = data.fileUrl;
                    return this.uploadImage(arr[1]);
                }).then((res) => {
                    let { code, msg, data} = res;
                    if (code !== '0000')
                        throw msg;
                    this.obj_hidden.receiptProImg2.value = data.fileUrl;
                    return this.uploadImage(arr[2]);
                }).then((res) => {
                    let { code, msg, data} = res;
                    if (code !== '0000')
                        throw msg;
                    this.obj_hidden.receiptProImg3.value = data.fileUrl;
                    this.use_protocol = true;
                }).catch((err) => {
                    Toast(err);
                })
            },
            /**图片上传*/
            uploadImage (image_base64) {
                return Auth.getToken().then(info => {
                    let options = {
                        method: 'POSTFILE',
                        body: {
                            file: image_base64,
                            req:{
                                file_type: 'jpeg',
                                need_thum: false,
                                token: info.token,
                                mobile: this.merc_mbl
                            }
                        },
                        loading: true,
                        http: true,    //上传图片走http
                    };
                    return Api.uploadImage(options)
                });
            },
            dateRule() {
                let start = this.obj_input.crpEffStartDt.value;
                let end = this.obj_input.crpEffEndDt.value;
                return start && end && start > end;
            },

            StoreDataCall(result) {
                console.log('result', result);
                this.certific(result);
                // 判断无卡时其他字段的显示状态
                // this.initNocardStatus();
            },
            StoreDerailsCall(result) {
                this.initDiable();
                // 判断无卡时其他字段的显示状态
                // this.initNocardStatus();
                // 进件做修改不需要验证码
                this.obj_input.checkCode.visible = false;
            },
            saveDataCall() {
                let param = {
                    mercMbl: this.obj_input.mercMbl,
                    mercCnm: this.obj_input.mercCnm,    // 商户名称
                };
                if (DataUtil.checkData(param)) return true;
            },
            // 获取存储数据
            // fetchStoreData () {
            //     if (!this.params.key) return null;
            //     Loading.show();
            //     EntryUtil.get(this.params.key).then(result => {
            //         DataUtil.assignmentData(result, this.obj_input);
            //         DataUtil.assignmentData(result, this.obj_hidden);
            //
            //         this.certific(result);
            //         // 判断无卡时其他字段的显示状态
            //         // this.initNocardStatus();
            //     }).catch((err) => {
            //         Toast('没有找到对应的值');
            //     }).finally(() => {
            //         Loading.hide();
            //     });
            // },

            // 获取详情存储数据
            // fetchStoreDerails () {
            //     if (!this.params.mbl) return null;
            //     Loading.show();
            //     Store.get('merc_details').then((result) => {
            //         console.log('已提交--------详情数据', result);
            //         this.mer_view_remark = result.merViewRemark;
            //         DataUtil.assignmentData(result, this.obj_input);
            //         DataUtil.assignmentData(result, this.obj_hidden);
            //         this.initDiable();
            //         // 判断无卡时其他字段的显示状态
            //         // this.initNocardStatus();
            //     }).catch((err)=>{
            //         console.log('err', err);
            //     }).finally(() => {
            //         Loading.hide();
            //     });
            // },

            initDiable() {
//                this.obj_input.certificNm.disabled = true;
                this.obj_input.certificNo.disabled = true;
                this.obj_input.mercCnm.disabled = true;
                this.obj_input.mercAbbr.disabled = true;
                this.obj_input.mercTypeMCCName.disabled = true;
                this.obj_input.mercArea.disabled = true;
                this.obj_input.busRegStartDt.value && (this.obj_input.busRegStartDt.disabled = true);
                this.obj_input.busRegEndDt.value && (this.obj_input.busRegEndDt.disabled = true);
                // this.obj_input.busRegNo.disabled = true;
            },
            // 法人增加字段
            certific(data) {
                this.obj_input.certificNm.value = data.crpNm ? data.crpNm : data.certificNm;
                this.obj_input.certificNo.value = data.crpNo ? data.crpNo : data.certificNo;
            },
            // 初始化无卡支付时其他字段显示状态
            initNocardStatus() {
                let type = (this.obj_input.weChat.value || this.obj_input.aliPay.value);
                this.obj_input.contactPhone.visible = type;
                this.obj_input.crpEffStartDt.visible = type;
                this.obj_input.crpEffEndDt.visible = type;
            },
            // 监听事件
            monitorEvent () {
                Channel.add($$SELECT_MCC, this.channelSelectMccHandle.bind(this));
            },

            // 销毁事件
            disMonitorEvent () {
                Channel.remove($$SELECT_MCC);
            },

            // 选择MCC监听处理
            channelSelectMccHandle (item = {}) {
                // console.log(item);
                let { name, code } = item;
                this.obj_input.mercTypeMCCName.value = name;
                this.obj_hidden.mercTypeMCC.value = code;
            },

            // 赋值
            handleInput (item, key, event) {
                if (key === 'mercRegAddr') {
                    this.obj_input.mercRegAddr.value = this.utf16toEntities(event.value);
                    return;
                }
                // console.log(item, key, event)
                item.value = event.value;
            },
            // 判断业务员权限，开通
            judgeUserAuth (item, value) {
                Auth.getToken().then((info) => {
                    switch (value) {
                        case 'jfbpos':
                            if (!info.jfbpos) return Toast('您没有该业务权限，请联系您的代理商');
                            item.value = value;
                            break;
                        case 'cpos':
                            if (!info.cpos) return;
                            item.value = value;
                            break;
                        default:
                            if (info.jfbpos) return this.obj_input.productType.value = 'jfbpos';
                            if (info.cpos) return this.obj_input.productType.value = 'cpos';
                            break;
                    }
                });
            },

            // 单选事件
            handleRadio (item, radio_item, key) {
                // if (item.disabled) return null;
                // if (key === 'productType') {
                //     return this.judgeUserAuth(item, radio_item.value)
                // }
                // item.value = radio_item.value;
                // this.openNoCard(key, item.value);
            },

            // 是否开通无卡
            openNoCard (key, value) {
                if (key === 'aliPay' || key === 'weChat') {
                    this.initNocardStatus();
                }
                if (key === 'aliPay' && value) {
                    let payments = this.obj_hidden.payments.value;
                    payments.indexOf('alipay') <= -1 && (this.obj_hidden.payments.value = payments + ',alipay');
                }
                if (key === 'aliPay' && !value) {
                    let payments = this.obj_hidden.payments.value;
                    payments.indexOf('alipay') > -1 && (this.obj_hidden.payments.value = payments.replace(',alipay', ''));
                }
                if (key === 'weChat' && value) {
                    let payments = this.obj_hidden.payments.value;
                    payments.indexOf('wechat') <= -1 && (this.obj_hidden.payments.value = payments + ',wechat');
                }
                if (key === 'weChat' && !value) {
                    let payments = this.obj_hidden.payments.value;
                    console.log(payments.indexOf('wechat'));
                    payments.indexOf('wechat') > -1 && (this.obj_hidden.payments.value =  payments.replace(',wechat', ''));
                }
            },

            // 选择事件
            handleSelect (item, key, text) {
                console.log('text----------', text)
                console.log('key----------', key)
                switch (text) {
                    case 'MCC码':
                        this.handleJump('common_merchant_mcc');
                        break;
                    case '所属地区':
                        this.popCity();
                        break;
                    case '身份证开始有效期':
                    case '身份证结束有效期':
                    case '营业执照开始日期(AB类必填)':
                    case '营业执照结束日期(AB类必填)':
                        this.popDate(item, key);
                        break;
                    case '协议开始日期':
                        this.popDate(item, key, 'effDt');
                        break;
                }
            },
            popDate(item, key, type) {
                Picker.pickDate({ value: 'yyyy-MM-dd'}).then((result) => {
                    let date = result.indexOf('-') > -1 && result.replace(/\-/g, '');
                    let start = date.length < 8 ? date.substring(0, 6) + '0' + date[date.length - 1] : date;
                    item.value = start;

                    if (type) {
                        let end = start.substring(0, 4) - 0 + 1 + start.substring(4, 8);
                        this.obj_hidden.expDt.value = end;
                    }
                }).catch((error) => {
                    console.log(error);
                    Toast('取消');
                })
            },

            // 弹窗所属地区级联
            popCity () {
                Loading.show();
                Api.getCity().then((city) => {
                    Picker.picks(city).then(result => {
                        // console.log(result)
                        this.obj_input.mercArea.value = result ? `${result[0].name} | ${result[1].name}` : '';
                        this.obj_hidden.mercProvName.value = result[0].name;
                        this.obj_hidden.mercProv.value = result[0].code;
                        this.obj_hidden.mercCityName.value = result[1].name;
                        this.obj_hidden.mercCity.value = result[1].code;
                    })
                }).catch((error) => {
                    Toast(error);
                }).finally(() => {
                    Loading.hide();
                });
            },
            handleRight(callback) {
                if (this.params.mbl) {
                    Dialogs.alert({
                        message: this.mer_view_remark,
                        okTitle: '知道了',
                    })
                } else {
                    this.saveData(true);
                }
            },


            // 保存数据
            saveData (type = true) {
                return new Promise ((resolve, reject) => {
                    let param = {
                        mercMbl: this.obj_input.mercMbl,
                        mercCnm: this.obj_input.mercCnm,    // 商户名称
                    };
                    if (DataUtil.checkData(param)) return null;
                    Loading.show();
                    let data = DataUtil.filterData({
                        ...this.obj_input,
                        ...this.obj_hidden,
                    });
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
            // saveDetail() {
            //     return new Promise((resolve, reject) => {
            //         let data = DataUtil.filterData({
            //             ...this.obj_input,
            //             ...this.obj_hidden,
            //         });
            //         Store.get('merc_details').then(res => {
            //             res = _.isObject(res) ? res : {};
            //             data = Object.assign(res, data);
            //             Store.set('merc_details', data).then(() => {
            //                 resolve();
            //             }).catch(() => {
            //                 reject('存储失败');
            //             })
            //         });
            //
            //     })
            // },

            // 下一步点击
            handleSubmit (callback) {
                // let start = this.obj_input.crpEffStartDt.value;
                // let end = this.obj_input.crpEffEndDt.value;
                // if (start && end && start >= end) {
                //     callback();
                //     return Toast('身份证件有效开始日期大于身份证件证件有效截止日期')
                // }
                // let payments = this.obj_hidden.payments.value;
                // if (this.obj_input.weChat.value || this.obj_input.aliPay.value) {
                //     payments.indexOf('qrpay') <= -1 && (this.obj_hidden.payments.value = payments + ',qrpay');
                // } else {
                //     payments.indexOf('qrpay') > -1 && (this.obj_hidden.payments.value = payments.replace(',qrpay', ''));
                // }

                // let payments = this.obj_hidden.payments.value;
                // payments.indexOf('qrpay') > -1 && (this.obj_hidden.payments.value = this.obj_hidden.payments.value.replace(',qrpay', ''));
                // payments.indexOf('wechat') > -1 && (this.obj_hidden.payments.value = this.obj_hidden.payments.value.replace(',wechat', ''));
                // payments.indexOf('alipay') > -1 && (this.obj_hidden.payments.value = this.obj_hidden.payments.value.replace(',alipay', ''));

                if (!this.use_protocol && !this.params.mbl && !this.obj_input.busRegNo.value) {
                    Toast('查看电子协议');
                    return callback();
                }
                this.obj_hidden.payments.value = 'cardpay';
                let options = {
                    ...this.obj_input,
                    ...this.obj_hidden,
                };
                if (DataUtil.checkData(options)) return callback();
                Auth.getToken().then((info) => {
                    Jf.getUUID(info.phoneNo).then(uuid => {
                        var options = {
                            method: 'POST',
                            body: {
                                token: info.token,
                                uuid: uuid,
                                mobileNo: this.obj_input.mercMbl.value,
                                checkCode: this.obj_input.checkCode.value,
                            },
                            loading: true
                        };
                        // 进件做修改不需要验证码
                        if (this.params.mbl) return {code: '0000'};
                        return Api.checkCode(options);
                    }).then(result => {
                        let { code, msg } = result;
                        if (code !== '0000') throw msg;
                        if (this.params.mbl) {
                            return this.saveDetail();
                        } else {
                            return this.saveData(false);
                        }
                    }).then(() => {
                        console.log('从详情页过来');
                        this.handleJump('common_merchant_aptitude_info', this.params);
                    }).catch(error => {
                        // if (this.params.mbl) {
                        //     this.saveDetail().then((res) => {
                        //         this.handleJump('common_merchant_aptitude_info', this.params);
                        //     })
                        // } else {
                        //     this.saveData(false).then((res)=>{
                        //         this.handleJump('common_merchant_aptitude_info', this.params);
                        //     })
                        // }
                        Toast(error)
                    });
                }).finally(() => {
                    callback();
                })
            },

            // 发送验证码
            handSendCode () {
                let param = this.obj_input.mercMbl;
                if (DataUtil.checkData({param})) return null;
                let options = {
                    method: 'GET',
                    body: {
                        code_type: '1',
                        mobile_phone: param.value,
                    },
                    loading: true,
                };
                Api.sendCode(options).then((result) => {
                    let {code, msg} = result;
                    if(code !== '0000') throw msg;
                    Toast('发送成功');
                    this.countDown();
                }).catch((error) => {
                    Toast(error)
                });
            },

            // 倒计时
            countDown () {
                if (this.num_count_down <= 1) return this.num_count_down = this.num_default_count_down;
                this.num_count_down--;
                setTimeout(this.countDown.bind(this), 1000)
            },

            // // 删除数据
            // handleRemove (params) {
            //     let key = params.key || '';
            //     EntryUtil.remove(key).finally(() => {
            //         console.log('shanchu');
            //     })
            // },
        },
        // 页面销毁
        destroyed () {
            // 销毁监听事件
            this.disMonitorEvent();
        },
        components: {
            // WowView,
            // WowInputCell,
            // ArrowTip,
            // WowTextArea,
            // WowButton,
        },
    }
</script>
<style>
    .send-code{
        width: 204px;
        height: 90px;
        background-color: #ddd;
        justify-content: center;
        align-items: center;
    }
    .send-code-color{
        background-color: #F76B1C;
    }
    .send-code-text{
        font-size: 28px;
        color: #fff;
    }
    .send-code-text-color{
        color: #ccc;
    }
    .cell-item{
        background-color: #fff;
    }
    .margin{
        margin-top: 20px;
    }
    .text-area{
        background-color: #fff;
        border-color: #ddd;
        border-bottom-width: 1px;
    }
    .text-area-label{
        padding-left: 32px;
        color: #333;
        font-size: 28px;
        margin-top: 22px;
    }
    .radio-box{
        flex: 1;
        flex-direction: row;
        align-items: center;
        margin-right: 32px;
        justify-content: flex-end;
    }
    .radio-item{
        margin-left: 52px;
        flex-direction: row;
        align-items: center;
    }
    .radio-image{
        width: 40px;
        height: 40px;
        margin-right: 8px;
    }
    .radio-text{
        font-size: 28px;
        color: #949494;
    }
    .radio-text-color{
        color: #949494;
    }
    .button{
        margin-left: 30px;
        margin-bottom: 80px;
    }
    .agreement{
        padding-left: 32px;
        font-size: 28px;
        color: #1aa2e6;
        line-height: 50px;
        margin-top: 20px;
    }
</style>
