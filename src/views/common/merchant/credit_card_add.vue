<template>
    <wow-view view_header_center_txt="新增信用卡">
        <div class="block">
            <div class="cell">
                <text class="label">信用卡号</text>
                <div class="form">
                    <input class="input" :value="card" @input="onInput('card', $event)" type="number"
                           placeholder="输入信用卡卡号"/>
                    <image class="icon" :src="icon_src" @click="handleScan"></image>
                </div>
            </div>
            <div class="cell">
                <text class="label">持卡人姓名</text>
                <input v-if="haspass" :class="['input', !haspass && 'input-disabled']" :disabled="!haspass"
                       :value="parmas.certificNm"
                       @input="onInput('parmas.certificNm', $event)" type="text" placeholder="输入持卡人姓名"/>
                <text v-if="!haspass" :class="['input', !haspass && 'input-disabled']">{{parmas.certificNm |
                    filterName}}
                </text>
            </div>
            <div class="cell cell_no">
                <text class="label">身份证号码</text>
                <input v-if="haspass" :class="['input', !haspass && 'input-disabled']" :disabled="!haspass"
                       :value="parmas.certificNo"
                       @input="onInput('parmas.certificNo', $event)" type="text" placeholder="输入持卡人姓名"/>
                <text v-if="!haspass" :class="['input', !haspass && 'input-disabled']">{{parmas.certificNo |
                    filterName}}
                </text>
            </div>
        </div>
        <div class="block">
            <div class="cell">
                <text class="label">预留手机号</text>
                <input class="input" :value="mobile" @input="onInput('mobile', $event)" type="tel"
                       placeholder="输入预留手机号"/>
            </div>
            <div class="cell">
                <input class="input align-left" type="tel" placeholder="验证码" :value="code"
                       @input="onInput('code', $event)"/>
                <code time="30" :check="mobile" @action="handSendCode" noradius="noradius" class="code" value="发送验证码"></code>
            </div>
        </div>
        <wow-button
            class="button"
            button_margin_top="80"
            @click="fetchAdd"
            :button_disabled="!card || !mobile || !code || !parmas.certificNm || !parmas.certificNo"
            button_txt="提交">
        </wow-button>
    </wow-view>

</template>

<style>
    .block {
        margin-top: 20px;
    }

    .cell {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        height: 88px;
        padding-left: 20px;
        padding-right: 20px;
        background-color: white;
        border-top-width: 1px;
        border-top-color: #e5e5e5;
        border-bottom-width: 1px;
        border-bottom-color: #e5e5e5;
        margin-top: -1px;
    }

    .label {
        font-size: 28px;
    }

    .form {
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        height: 88px;
    }

    .input {
        height: 88px;
        width: 450px;
        align-items: center;
        text-align: right;
        padding-right: 20px;
        font-size: 28px;
        line-height: 88px;
    }

    .input-disabled {
        color: #9b9b9b;
    }

    .icon {
        width: 42px;
        height: 42px;
    }

    .note {
        font-size: 28px;
        color: #9b9b9b;
    }

    .code {
        border-width: 2px;
        /*border-color: #0076FF;*/
        width: 160px;
        height: 62px;
        border-radius: 14px;
        align-items: center;
        justify-content: center;
        background-color: #F76B1C;
    }

    .disable {
        border-color: #ccc;
    }

    .code-txt {
        font-size: 28px;
        color: #0076FF;
    }

    .code-txt-disable {
        color: #ccc;
    }

    .warning {
        margin-top: 40px;
        padding: 20px;
    }

    .warning-txt {
        margin-top: 10px;
        font-size: 28px;
        color: #9b9b9b;
    }

    .align-left {
        text-align: left;
    }

    .button {
        margin-left: 32px;
        margin-right: 32px;
    }
</style>

<script>
    import WowView from 'wow-weex/lib/wow-view'
    import WowButton from 'wow-weex/lib/wow-button'
    import Source from 'utils/source.util'
    import Auth from 'helpers/auth'
    import request from 'helpers/request';
    import dialogs from 'plugins/dialogs';
    import channel from 'plugins/channel';
    import ocr from 'plugins/ocr';
    import picker from 'plugins/picker';
    import router from 'plugins/router';
    import Jf                       from 'helpers/jfservice'
    import Api from 'api/entry.api'
    import FilterMixin from 'mixins/filter.mixin'

    export default {
        mixins: [FilterMixin],
        components: {
            WowView,
            WowButton,
            code: require('components/common/code.vue'),
        },
        data() {
            return {
                card: '',
                mobile: '',
                code: '',
                haspass: false,
                icon_src: Source('bind_scan.png'),
                parmas: {}
            }
        },

        methods: {
            onInput(key, event) {
                if (key.indexOf('.') > -1) {
                    let key_arr = key.split('.');
                    this[key_arr[0]][key_arr[1]] = event.value;
                } else {
                    this[key] = event.value;
                }
            },

            // 发送验证码
            handSendCode () {
                if (!this.mobile) return null;
                let options = {
                    method: 'GET',
                    body: {
                        code_type: '1',
                        mobile_phone: this.mobile,
                    },
                    loading: true,
                };
                Api.sendCode(options).then((result) => {
                    let {code, msg} = result;
                    if(code !== '0000') throw msg;
                    dialogs.toast({message: '发送成功'});
                    this.countDown();
                    this.countDown();
                }).catch((error) => {
                    dialogs.toast({message: error});
                });
            },
            // 增加信用卡
            fetchAdd(callback) {
                callback && callback();
                if (!this.card) return dialogs.toast({message: '请输入信用卡'});
                if (!this.code) return dialogs.toast({message: '请输入验证码'});
                if (!this.parmas.certificNm) return dialogs.toast({message: '请输入持卡人姓名'});
                if (!this.parmas.certificNo) return dialogs.toast({message: '请输入持卡人身份证号码'});
                if (!this.mobile) return dialogs.toast({message: '请输入银行预留手机号'});
                Auth.getToken().then((info) => {
                    Jf.getUUID(info.phoneNo).then(uuid => {
                        var options = {
                            method: 'POST',
                            body: {
                                token: info.token,
                                uuid: uuid,
                                mobileNo: this.mobile,
                                checkCode: this.code,
                            },
                            loading: true
                        };
                        Api.checkCode(options).then((res) => {
                            if (res.code !== '0000') throw res.msg;
                            let options = {
                                method: 'POST',
                                body: {
                                    token: info.token,
                                    name: this.parmas.certificNm, // 持卡人姓名
                                    cardId: this.parmas.certificNo,// 身份证号
                                    bankNo: this.card, // 银行卡号
                                    mobil: this.mobile, // 银行预留手机号
                                    mercId: this.parmas.customerId,
                                },
                                loading: true,
                            };
                            Api.AddCreditCard(options).then((result) => {
                                let {code, msg} = result;
                                if (code !== '000000') throw dialogs.toast({message: msg});
                                dialogs.toast({message: '添加成功！'});
                                channel.post('$$CreditCard', {});
                                router.pop();
                            }).catch(error => {
                                dialogs.toast({message: error});
                            });
                        }).catch(error => {
                            dialogs.toast({message: error});
                        });
                    }).catch(error => {
                        dialogs.toast({message: error});
                    });
                }).finally(() => {
                    // callback();
                })
            },

            // 扫描信用卡
            handleScan: function (e) {
                var self = this;
                picker.pick({
                    index: 0,
                    items: ["横版信用卡", "竖版信用卡"]
                }).then(function (index) {
                    if (index === -1) return 'cancel';
                    let orientation = index == 0 ? 'HORIZONTAL' : 'VERTICAL';
                    let key = ocr.isSupport ? 'scanBankCardInfo' : 'scanBankCard';
                    return ocr[key]({
                        'orientation': orientation
                    });
                }).then(function (e) {
                    if (e === 'cancel') return;
                    self.card = e.cardNum;
                }).catch(function (error) {
                    dialogs.toast({message: error});
                });
            },
        },

        created() {
            let parmas = router.getParmas(this) || {};
            this.parmas = parmas || {};
            this.mobile = parmas.mercMbl || '';
            this.haspass = parmas.haspass || false;
            console.log('this.parmas', this.parmas);
        }
    }
</script>
