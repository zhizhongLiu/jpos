<template>
    <wow-view :view_header_right_txt="computedRightTxt"
        :view_header_right_color="params.mbl ? '#5A5D62':'#F76B1C'"
        @rightItemClick="handleRight"
        :view_header_right_src="params.mbl && !params.type ? rightSrc: ''"
        view_header_center_txt="结算信息">
        <template v-for="(item, key) in obj_input">
            <div>
                <wow-input-cell
                    v-if="key !== 'mercAuditRemark' && item.visible !== false"
                    class="cell-item"
                    @click="handleSelect(item.label)"
                    :class="[item.is_margin && 'margin']"
                    :input_value="item.value"
                    :input_placeholder="item.placeholder"
                    :input_label_txt="item.label"
                    :input_max_length="item.max_length"
                    :input_type="item.type || 'text'"
                    :input_disabled="is_disabled || item.disabled"
                    :input_use="item.use_input !== false"
                    :input_use_right="item.use_input_right !== false"
                    :key="key"
                    @input="handleInput(item, key, $event)">
                    <arrow-tip slot="input_unit"
                        v-if="item.use_arrow"></arrow-tip>
                    <div class="radio-box"
                        slot="input_unit"
                        v-if="item.use_radio && !is_disabled">
                        <div class="radio-item"
                            @click="handleRadio(item, radio_item)"
                            v-for="(radio_item, radio_index) in item.use_radio" :key="radio_index">
                            <image class="radio-image"
                                :src="item.value === radio_item.value ? src_radio_checked : src_radio_normal"></image>
                            <text class="radio-text"
                                :class="[item.value === radio_item.value && 'radio-text-color']">{{radio_item.text}}</text>
                        </div>
                    </div>
                </wow-input-cell>
            </div>
            <div v-if="key === 'mercAuditRemark'"
                class="text-area">
                <text class="text-area-label">{{item.label}}</text>
                <wow-text-area :text_value="item.value"
                    :text_max_lenght="item.max_length"
                    @input="handleInput(item, key, $event)"
                    :text_placeholder="item.placeholder"
                    text_border_color="#fff">
                </wow-text-area>
            </div>
        </template>
        <image-upload :image_arr="obj_image" :merc_mbl="obj_hidden.mercMbl.value"></image-upload>
        <text class="prompt">{{str_prompt}}</text>
        <wow-button class="button"
            button_margin_top="80"
            @click="handleSubmit"
            :button_disabled="computedButton"
            button_txt="下一步">
        </wow-button>
    </wow-view>
</template>
<script>
    import WowView from 'wow-weex/lib/wow-view'
    import WowInputCell from 'wow-weex/lib/wow-input-cell'
    import WowTextArea from 'wow-weex/lib/wow-text-area'
    import WowButton from 'wow-weex/lib/wow-button'
    import ArrowTip from 'components/merchant/arrow-tip'
    import Router from 'plugins/router'
    import ImageUpload from 'components/merchant/image-upload'
    import Source from 'utils/source.util'
    import DataUtil from 'utils/data.util'
    import EntryUtil from 'utils/entry.util'
    import Store    from 'utils/store'
    import _ from 'utils/lodash/lodash'
    import Loading from 'plugins/loading'
    import Toast from 'helpers/toast'
    import Api from 'api/entry.api'
    import Picker from 'plugins/picker'
    import Channel from 'plugins/channel'
    import Dialogs from 'plugins/dialogs'
    import Auth from 'helpers/auth'
    import SettlementMixin            from 'mixins/merchant/settlement.mixin'
    import RegMixin                 from 'mixins/merchant/reg.mixin'

    const $$SELECT_BANK = '$$SELECT_BANK';
    const $$SELECT_BRANCH = '$$SELECT_BRANCH';

    export default {
        mixins: [SettlementMixin, RegMixin],
        data() {
            return {
                is_type: false,
                is_disabled: false,
                obj_timer: '',
                src_radio_checked: Source('dtb_radio01_checked.png'),
                src_radio_normal: Source('dtb_radio01_normal.png'),
                rightSrc: Source('sp_xq2.png'),
                str_prompt: `温馨提示：\n企业类商户若结算授权书未盖公章，必须补充以下四项之一：租赁协议、结算人手持执照原件照片、法人和结算人身份证正面合照、法人和结算人合照。`,
            }
        },
        created() {
            // 获取参数
            this.fetchPageParams();
            // 获取详情中存储的数据
            this.fetchStoreData(this.StoreDataCall);
            // 获取详情存储的数据
            this.fetchStoreDerails(this.StoreDerailsCall);
            // 监听事件
            this.monitorEvent();
        },
        methods: {
            StoreDataCall(result) {
                // 如果数据中没有结算人身份证号和手机号 取法人身份证号和手机号显示
                if (!this.obj_input.settCrpNo.value || !this.obj_input.bankMbl.value) {
                    this.obj_input.settCrpNo.value = this.obj_hidden.certificNo.value || '';    // 结算人身份证号
                    this.obj_input.bankMbl.value = this.obj_hidden.mercMbl.value || '';  // 银行预留手机号
                }
                let { busRegNo } = result;
                if (!busRegNo) {
                    this.obj_input.settAccMark.disabled = true;
                    this.obj_input.settCrpNo.disabled = true;
                    this.obj_input.settAccNm.disabled = true;
                    this.obj_input.settAccMark.value = '1';

                    this.judgeAccount();
                }
                this.isPrivate();
                this.isLegalpersonIsSett();
                // if (this.obj_input.settAccMark.value !== '0' && this.obj_hidden.weChat.value) {
                //     this.obj_input.wechatId.visible = true;
                // }
            },
            StoreDerailsCall(result) {
                this.queryCardBin(this.obj_input.settAccount.value, true);
                // 如果数据中没有结算人身份证号和手机号 取法人身份证号和手机号显示
                if (!this.obj_input.settCrpNo.value || !this.obj_input.bankMbl.value) {
                    this.obj_input.settCrpNo.value = this.obj_hidden.certificNo.value || '';    // 结算人身份证号
                    this.obj_input.bankMbl.value = this.obj_hidden.mercMbl.value || '';  // 银行预留手机号
                }
                let { busRegNo } = result;
                if (!busRegNo) {
                    this.obj_input.settAccMark.disabled = true;
                    this.obj_input.settCrpNo.disabled = true;
                    this.obj_input.settAccNm.disabled = true;
                    this.obj_input.settAccMark.value = '1';

                    this.judgeAccount();
                }
                this.isPrivate();
                this.isLegalpersonIsSett();
                // if (this.obj_input.settAccMark.value !== '0' && this.obj_hidden.weChat.value) {
                //     this.obj_input.wechatId.visible = true;
                // }
            },

            // 获取存储数据
            // fetchStoreData() {
            //     if (!this.params.key) return null;
            //     Loading.show();
            //     EntryUtil.get(this.params.key).then(result => {
            //         DataUtil.assignmentData(result, this.obj_input);
            //         DataUtil.assignmentData(result, this.obj_image);
            //         DataUtil.assignmentData(result, this.obj_hidden);
            //         if (!this.obj_input.settCrpNo.value || !this.obj_input.bankMbl.value) {
            //             this.obj_input.settCrpNo.value = this.obj_hidden.certificNo.value || '';    // 结算人身份证号
            //             this.obj_input.bankMbl.value = this.obj_hidden.mercMbl.value || '';  // 银行预留手机号
            //         }
            //         this.isPrivate();
            //         // if (this.obj_input.settAccMark.value !== '0' && this.obj_hidden.weChat.value) {
            //         //     this.obj_input.wechatId.visible = true;
            //         // }
            //     }).catch((err) => {
            //         Toast('没有找到对应的值');
            //     }).finally(() => {
            //         Loading.hide();
            //     });
            // },

            // 获取详情存储数据
            // fetchStoreDerails() {
            //     if (!this.params.mbl) return null;
            //     Loading.show();
            //     Store.get('merc_details').then((result) => {
            //         console.log('已提交--------详情数据', result);
            //         this.mer_view_remark = result.merViewRemark;
            //         DataUtil.assignmentData(result, this.obj_input);
            //         DataUtil.assignmentData(result, this.obj_image);
            //         DataUtil.assignmentData(result, this.obj_hidden);
            //
            //         this.queryCardBin(this.obj_input.settAccount.value, true);
            //         if (!this.obj_input.settCrpNo.value || !this.obj_input.bankMbl.value) {
            //             this.obj_input.settCrpNo.value = this.obj_hidden.certificNo.value || '';    // 结算人身份证号
            //             this.obj_input.bankMbl.value = this.obj_hidden.mercMbl.value || '';  // 银行预留手机号
            //         }
            //         this.isPrivate();
            //         // if (this.obj_input.settAccMark.value !== '0' && this.obj_hidden.weChat.value) {
            //         //     this.obj_input.wechatId.visible = true;
            //         // }
            //     }).catch((err) => {
            //     }).finally(() => {
            //         Loading.hide();
            //     });
            // },
            isPrivate() {
                let type = this.obj_input.settAccMark.value === '0';
                this.obj_input.settCrpNo.visible = !type;
                this.obj_input.bankMbl.visible = !type;
            },
            // 赋值
            handleInput(item, key, event) {
                console.log('赋值', key, event);
                if (key === 'settAccount' && event.value === this.obj_input.settAccount.value) return;

                if (key === 'mercAuditRemark') {
                    this.obj_input.mercAuditRemark.value = this.utf16toEntities(event.value);
                    return;
                }
                item.value = event.value;
                if (key === 'settCrpNo') {
                    this.isLegalpersonIsSett(true);
                }
                if (key !== 'settAccount') return;
                this.obj_input.settBankNm.value = '';
                this.obj_hidden.bank_cd.value = '';
                this.queryCardBin(item.value);
            },
            // 是否非法人及其他字段状态显示
            isLegalpersonIsSett(status) {
                let type = !(this.obj_input.settAccMark.value === '0') && this.obj_input.settCrpNo.value !== this.obj_hidden.certificNo.value;
                if(status) {
                    this.obj_hidden.legalpersonIsSett.value = type ? 'Y' : 'N';
                }
//                this.obj_hidden.legalpersonIsSett.value = type ? 'Y' : 'N';
                this.obj_image.nonCrpNmSettleProImg.visible = type;

                this.obj_image.settCrpAboveImg.visible = type;
                this.obj_image.settCrpBelovImg.visible = type;
            },
            // 单选事件
            handleRadio(item, radio_item) {
                if (item.disabled) return null;
                item.value = radio_item.value;
                this.judgeAccount();
            },
            // 判断对公对私
            judgeAccount() {
                let type = this.obj_input.settAccMark.value === '0';
                console.log(type);
                this.obj_input.settAccNm.value = !type ? this.obj_hidden.certificNm.value : '';  // 账户名
                this.obj_input.settCrpNo.value = !type ? this.obj_hidden.certificNo.value : '';    // 结算人身份证号
                this.obj_input.bankMbl.value = !type ? this.obj_hidden.mercMbl.value : '';  // 银行预留手机号
                this.obj_input.settCrpNo.visible = !type;
                this.obj_input.bankMbl.visible = !type;

                this.obj_image.nonCrpNmSettleProImg.value = '';
                this.obj_image.settCrpAboveImg.value = '';
                this.obj_image.settCrpBelovImg.value = '';

                this.isLegalpersonIsSett(true);
                // this.obj_input.wechatId.visible = !type && this.obj_hidden.weChat.value;
                // this.obj_input.wechatId.value = '';
            },

            // 监听事件
            monitorEvent() {
                Channel.add($$SELECT_BANK, this.channelSelectBankHandle.bind(this));
                Channel.add($$SELECT_BRANCH, this.channelSelectBranchHandle.bind(this));
            },

            // 销毁事件
            disMonitorEvent() {
                Channel.remove($$SELECT_BANK);
                Channel.remove($$SELECT_BRANCH);
            },

            // 选择银行监听
            channelSelectBankHandle(item = {}) {
                let { bank_name, short_bank_no } = item;
                this.obj_input.settBankNm.value = bank_name;
                this.obj_hidden.bank_cd.value = short_bank_no;
            },

            // 选择支行监听
            channelSelectBranchHandle(item = {}) {
                let { bankName, bankNo } = item;
                this.obj_input.bankBranchName.value = bankName;
                this.obj_hidden.lankNo.value = bankNo;
            },


            // 执行卡bin验证
            queryCardBin(value, is_detail) {
                if (value.length < 10) return;
                Auth.getToken().then(info => {
                    let options = {
                        method: 'POST',
                        body: {
                            token: info.token,
                            cardNo: value,
                        },
                    };
                    Api.queryCardBinByCardNumber(options).then(result => {
                        let { code, data } = result;
                        if (code !== '0000') return;
                        data = data ? JSON.parse(data) : {};
                        let { cardNameCn, shortBankNo } = data;
                        this.obj_hidden.bank_cd.value = shortBankNo;
                        if (is_detail) return;
                        cardNameCn = cardNameCn.substr(0, cardNameCn.indexOf('银行') + 2);
                        this.obj_input.settBankNm.value = cardNameCn;
                    }).catch(error => {
                        Toast(error);
                    })
                })
            },


            // 选择事件
            handleSelect(text) {
                switch (text) {
                    case '开户地':
                        this.popOpenAddress();
                        break;
                    case '银行名称':
                        this.handleJump('common_merchant_card_list');
                        break;
                    case '支行信息':
                        if (!this.obj_input.settAccount.value) return Toast('请先输入银行卡号');
                        if (!this.obj_input.openAccountAddress.value) return Toast('请先选择开户地');
                        let params = DataUtil.filterData(this.obj_hidden);
                        this.handleJump('common_merchant_branch_bank', params);
                        break;
                }
            },

            // 弹窗开户地
            popOpenAddress() {
                Loading.show();
                Api.getCity().then((city) => {
                    Picker.picks(city).then(result => {
                        this.obj_input.openAccountAddress.value = result ? `${result[0].name} | ${result[1].name}` : '';
                        this.obj_hidden.city_cd.value = result[1].code;
                    })
                }).catch((error) => {
                    Toast(error);
                }).finally(() => {
                    Loading.hide();
                });
            },



            // 保存数据
            // saveData(type = true) {
            //     return new Promise((resolve, reject) => {
            //         Loading.show();
            //         let data = DataUtil.filterData({
            //             ...this.obj_input,
            //             ...this.obj_image,
            //             ...this.obj_hidden,
            //         });
            //         data.key = this.params.key;
            //         EntryUtil.save(data).then((result) => {
            //             this.params.key = result.key;
            //             type && Toast('保存成功');
            //             resolve();
            //         }).catch(() => {
            //             type && Toast('保存失败');
            //             reject();
            //         }).finally(() => {
            //             Loading.hide();
            //         });
            //     })
            // },

            // 重新提交保存
            // saveDetail() {
            //     return new Promise((resolve, reject) => {
            //         Loading.show();
            //         let data = DataUtil.filterData({
            //             ...this.obj_input,
            //             ...this.obj_image,
            //             ...this.obj_hidden,
            //         });
            //         console.log('filterData',data);
            //         Store.get('merc_details').then(res => {
            //             res = _.isObject(res) ? res : {};
            //             data = Object.assign(res, data);
            //             Store.set('merc_details', data).then(() => {
            //                 resolve();
            //             }).catch(() => {
            //                 reject('存储失败');
            //             })
            //         });
            //     })
            // },

            // 下一步点击
            handleSubmit(callback) {
                let options = {
                    ...this.obj_input,
                    ...this.obj_image,
                };
                if (DataUtil.checkData(options)) return callback();
                if (this.params.mbl) {
                    this.saveDetail().then(() => {
                        this.handleJump('common_merchant_rate_info', this.params);
                    }).catch(() => {
                        this.handleJump('common_merchant_rate_info', this.params);
                    }).finally(() => {
                        callback();
                    });
                } else {
                    this.saveData(false).then(() => {
                        this.handleJump('common_merchant_rate_info', this.params);
                    }).catch(() => {
                        Toast('保存失败');
                        this.handleJump('common_merchant_rate_info', this.params);
                    }).finally(() => {
                        callback();
                    });
                }
            },

        },
        // 页面销毁
        destroyed() {
            // 销毁监听事件
            this.disMonitorEvent();
        },
        components: {
            // WowView,
            // WowInputCell,
            // ArrowTip,
            // WowTextArea,
            // WowButton,
            // ImageUpload,
        }
    }
</script>
<style>
    .prompt {
        line-height: 34px;
        padding-left: 30px;
        padding-right: 30px;
        font-size: 24px;
        color: #949494;
    }

    .cell-item {
        background-color: #fff;
    }

    .margin {
        margin-top: 20px;
    }

    .text-area {
        background-color: #fff;
    }

    .text-area-label {
        padding-left: 32px;
        color: #333;
        font-size: 28px;
        margin-top: 22px;
    }

    .radio-box {
        flex-direction: row;
        align-items: center;
        flex: 1;
        margin-right: 32px;
        justify-content: flex-end;
    }

    .radio-item {
        margin-left: 52px;
        flex-direction: row;
        align-items: center;
    }

    .radio-image {
        width: 40px;
        height: 40px;
        margin-right: 8px;
    }

    .radio-text {
        font-size: 32px;
        color: #949494;
    }

    .radio-text-color {
        color: #949494;
    }

    .button {
        margin-left: 30px;
        margin-bottom: 80px;
    }
</style>
