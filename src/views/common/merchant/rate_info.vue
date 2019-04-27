<template>
    <wow-view
        :view_header_right_txt="computedRightTxt"
        :view_header_right_color="params.mbl ? '#5A5D62':'#F76B1C'"
        @rightItemClick="handleRight"
        :view_header_right_src="params.mbl && !params.type ? rightSrc: ''"
        view_header_center_txt="费率设置">
        <div v-for="(item, key) in obj_input"
             :key="key">
            <input-fee-cell
                class="cell-item"
                v-if="item.visible !== false"
                :class="[item.is_margin && 'margin']"
                :input_value="item.value"
                :input_maxlength="item.max_length"
                :input_placeholder="item.placeholder"
                :input_label_txt="item.label"
                :input_type="item.type"
                :input_disabled="is_disabled || item.disabled"
                :input_use="item.use_input !== false"
                :input_use_right="item.use_input_right !== false"
                :input_match_type="item.use_input_match_type !== false"
                @input="handleInput(item, key, $event)">
                <div class="radio-box" slot="input_unit" v-if="item.use_radio && !is_disabled">
                    <div class="radio-item"
                         @click="handleRadio(item, radio_item)" v-for="(radio_item, radio_index) in item.use_radio" :key="radio_index">
                        <image class="radio-image" :src="item.value === radio_item.value ? src_radio_checked : src_radio_normal"></image>
                        <text class="radio-text" :class="[item.value === radio_item.value && 'radio-text-color']">{{radio_item.text}}</text>
                    </div>
                </div>
                <div slot="input_unit" class="input-unit" v-if="item.unit">
                    <text class="unit-text">{{item.unit}}</text>
                </div>
            </input-fee-cell>
        </div>
        <!-- <text>金额</text>
        <text>{{options}}</text> -->
        <!-- <text>{{obj_input}}</text> -->
        <wow-button
            class="button"
            button_margin_top="80"
            :button_disabled="computedButton"
            @click="handleSubmit"
            button_txt="提交">
        </wow-button>
    </wow-view>
</template>
<script>
    import WowView                  from 'wow-weex/lib/wow-view'
    import WowButton                from 'wow-weex/lib/wow-button'
    import ArrowTip                 from 'components/merchant/arrow-tip'
    import InputFeeCell             from 'components/merchant/input-fee-cell'
    import Router                   from 'plugins/router'
    import Source                   from 'utils/source.util'
    import DataUtil                 from 'utils/data.util'
    import EntryUtil                from 'utils/entry.util'
    import _                        from 'utils/lodash/lodash'
    import Store                    from 'utils/store'
    import Loading                  from 'plugins/loading'
    import Dialogs                  from 'plugins/dialogs'
    import Toast                    from 'helpers/toast'
    import Api                      from 'api/entry.api'
    import Auth                     from 'helpers/auth'
    import RateMixin                from 'mixins/merchant/rate.mixin'
    import RegMixin                 from 'mixins/merchant/reg.mixin'

    export default {
        mixins: [RateMixin, RegMixin],
        data () {
            return {
                is_disabled: false,
                src_radio_checked: Source('dtb_radio01_checked.png'),
                src_radio_normal: Source('dtb_radio01_normal.png'),
                rightSrc: Source('sp_xq2.png'),
                options: '4'
            }
        },
        created () {
            // 获取参数
            this.fetchPageParams();
            // 获取详情中存储的数据
            this.fetchStoreData(this.StoreDataCall);
            // 获取详情存储的数据
            this.fetchStoreDerails(this.StoreDerailsCall);
        },
        methods: {
            StoreDataCall(result) {
                // this.judgeNoCardFee();
                if (this.obj_hidden.settAccMark.value === '0'|| this.obj_hidden.legalpersonIsSett.value === 'Y') {
                    this.obj_input.settMark.value = 'T1';
                    this.obj_input.d0FeeDebit1.visible = false;
                    this.obj_input.d0FeeCredit1.visible = false;
                    this.obj_input.d0FeeDebit1.value = '';
                    this.obj_input.d0FeeCredit1.value = '';
                    return;
                }
                this.judgeType();
            },
            StoreDerailsCall(result) {
                // this.obj_input.dbMercMaxAmt.value = this.obj_input.dbMercMaxAmt.value / 100;
                // this.obj_input.noCardSettFee.value = this.obj_hidden.wechatFee.value || this.obj_hidden.alipayFee.value;
                // 判断是否为D0业务
                // let type = this.obj_input.settMark.value === 'T0';  //true
                // this.obj_input.settMark.value = type ? 'D0' : 'T1';
                // this.obj_input.mercD0Fee.visible = type;
                if (this.obj_hidden.settAccMark.value === '0'|| this.obj_hidden.legalpersonIsSett.value === 'Y') {
                    console.log('1111111111')
                    this.obj_input.settMark.value = 'T1';
                    this.obj_input.d0FeeDebit1.visible = false;
                    this.obj_input.d0FeeCredit1.visible = false;
                    this.obj_input.d0FeeDebit1.value = '';
                    this.obj_input.d0FeeCredit1.value = '';
                    return;
                }
                this.judgeType();
                // this.d0DataConvert();
            },

            // 获取存储数据
            // fetchStoreData () {
            //     if (!this.params.key) return null;
            //     Loading.show();
            //     EntryUtil.get(this.params.key).then(result => {
            //         DataUtil.assignmentData(result, this.obj_input);
            //         DataUtil.assignmentData(result, this.obj_hidden);
            //         // this.judgeNoCardFee();
            //         this.judgeType();
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
            //         DataUtil.assignmentData(result, this.obj_hidden);
            //         // this.obj_input.dbMercMaxAmt.value = this.obj_input.dbMercMaxAmt.value / 100;
            //         // this.obj_input.noCardSettFee.value = this.obj_hidden.wechatFee.value || this.obj_hidden.alipayFee.value;
            //         // 判断是否为D0业务
            //         // let type = this.obj_input.settMark.value === 'T0';  //true
            //         // this.obj_input.settMark.value = type ? 'D0' : 'T1';
            //         // this.obj_input.mercD0Fee.visible = type;
            //         this.judgeType();
            //         // this.d0DataConvert();
            //     }).catch((err) => {
            //     }).finally(() => {
            //         Loading.hide();
            //     });
            // },

            // 赋值
            handleInput (item, key, event) {
                item.value = event.value;
                // if (key === 'noCardSettFee') this.judgeNoCardFee();
            },

            // 判断无卡费率
            judgeNoCardFee () {
                this.obj_hidden.wechatFee.value = this.obj_input.noCardSettFee.value;
                this.obj_hidden.alipayFee.value = this.obj_input.noCardSettFee.value;
            },

            // 判断D0页面
            judgeType () {
                let type = this.obj_input.settMark.value === 'D0';
                console.log('type', type);
                this.obj_input.d0FeeDebit1.visible = type;
                this.obj_input.d0FeeCredit1.visible = type;

                if (type) return;

                this.obj_input.d0FeeDebit1.value = '';
                this.obj_input.d0FeeCredit1.value = '';
            },

            // 单选事件
            handleRadio (item, radio_item) {
                if ((this.obj_hidden.settAccMark.value === '0' || this.obj_hidden.legalpersonIsSett.value === 'Y') && radio_item.value === 'D0') return null;
                item.value = radio_item.value;
                // let type = item.value === 'D0';
                // this.obj_input.mercD0Fee.value = type ? this.obj_input.mercD0Fee.value : '';
                // this.obj_input.mercD0Fee.visible = type;
                // this.obj_hidden.mercD0FeeTyp.value = '';
                this.judgeType();
            },
            // 保存数据
            // saveData (type = true) {
            //     return new Promise ((resolve, reject) => {
            //         Loading.show();
            //         let data = DataUtil.filterData({
            //             ...this.obj_input,
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
            //     })
            // },

            // 下一步点击
            handleSubmit (callback) {
                let options = {
                    ...this.obj_input,
                    ...this.obj_hidden,
                };
                if (DataUtil.checkData(options)) return callback();
                Auth.getToken().then((info) => {
                    if (this.params.mbl) {
                        this.saveDetail().then(() => {
                            return Store.get('merc_details');
                        }).then((data) => {
                            this.submitData(info, data, callback);
                        }).catch(error => {
                            Toast(error)
                        });
                    } else {
                        this.saveData(false).then(() => {
                            return EntryUtil.get(this.params.key);
                        }).then((data) => {
                            this.submitData(info, data, callback);
                        }).catch((error) => {
                            Toast(error)
                        });
                    }
                }).catch((error) => {
                    Toast(error)
                }).finally(() => {
                    callback();
                });
            },
            // 提交数据
            submitData(info, data, callback) {
                let fee = {         // 贷记卡
                    basisRate: '0',           // 基础费率(比例)
                    lowestAmount: '0',        // 最低收费
                    highestAmount: '0',       // 最高收费
                    otherRate: '0',           // 其他固定收费
                    otherBasisRate: '0',      // 其他附加基础费率
                    otherLowestAmount: '0',   // 其他附加最低收费
                    otherHighestAmount: '0',  // 其他附加最高收费
                    otherAmount: '0',         // 其他附加固定收费金额
                };
                // let other = {       // 其他
                //     otherBasisRate: 0,
                //     otherLowestAmount: 0,
                //     otherHighestAmount: 0,
                //     otherAmount: 0,
                // };
                let feeData = {};           // 费率类型
                let creditCard = {};        // 贷记卡
                let debitCard = '';         // 借记卡
                let creditCard_D0 = '';     // D0贷记卡费率
                let debitCard_D0 = '';      // D0 借记卡费率

                creditCard = { ...fee, basisRate: data.crdCardSettFee };
                debitCard = { ...fee, basisRate: data.dbCardSettFee, highestAmount: (data.dbMercMaxAmt-0) * 10000 / 100 + '' };
                creditCard_D0 = { ...fee, basisRate: data.d0FeeCredit1 };
                debitCard_D0 = { ...fee, basisRate: data.d0FeeDebit1 };
                feeData.creditCard = creditCard;
                feeData.debitCard = debitCard;
                feeData.creditCard_D0 = creditCard_D0;
                feeData.debitCard_D0 = debitCard_D0;
                data.feeData = feeData;
                console.log(feeData);
                let d0Debit = data.d0FeeDebit1 + '|0|0|0'
                data.d0debitCardFee = d0Debit;
                let d0Credit = data.d0FeeCredit1 + '|0|0|0'
                data.d0creditCardFee = d0Credit;

                if (data.mercD0FeeTyp === '' || data.settMark === 'T1') {
                    data.d0debitCardFee && delete data.d0debitCardFee;
                    data.d0creditCardFee && delete data.d0creditCardFee;
                    data.feeData.creditCard_D0 && delete data.feeData.creditCard_D0;
                    data.feeData.debitCard_D0 && delete data.feeData.debitCard_D0;
                }
                // if (!data.aliPay && !data.weChat) {
                //     data.contactPhone && delete data.contactPhone;
                //     data.crpEffStartDt && delete data.crpEffStartDt;
                //     data.crpEffEndDt && delete data.crpEffEndDt;
                // }
                var options = {
                    method: 'POST',
                    body: {
                        token: info.token,
                        agtMercId: info[data.productType].agentId || '',
                        expandId: info[data.productType].customerId || '',
                        ...data,
                    },
                    loading: true
                };
                console.log(data);
                if (this.params.mbl) {
                    // console.log(4444);
                    Api.updateMerchantInfo(options).then(result => {
                        console.log(result);
                        let { code, msg } = result;
                        if (code !== '0000') throw msg;
                            Toast('进件成功');
                            callback();
                            Router.root();
                    }).catch((error) => {
                        callback();
                        Toast(error)
                    });
                } else {
                    Api.subData(options).then(result => {
                        let { code, msg } = result;
                        if (code !== '0000') throw msg;
                        EntryUtil.remove(this.params.key).finally(() => {
                            Toast('进件成功');
                            callback();
                            Router.root();
                        })
                    }).catch((error) => {
                        callback();
                        Toast(error)
                    });
                }
            },
        },
        components: {
            // WowView,
            // ArrowTip,
            // WowButton,
            InputFeeCell,
        }
    }
</script>
<style>
    .cell-item{
        background-color: #fff;
    }
    .margin{
        margin-top: 20px;
    }
    .button{
        margin-left: 30px;
        margin-bottom: 80px;
    }
    .radio-box{
        flex-direction: row;
        align-items: center;
        flex: 1;
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
    .input-unit{
        width: 40px;
        height: 40px;
        justify-content: center;
        margin-right: 32px;
    }
    .input-tow-unit{
        flex-direction: row;
        align-items: center;
        margin-right: 32px;
    }
    .unit-text{
        font-size: 28px;
        color: #3A3A3A;
        text-align: center;
    }
    .input-tow{
        margin-left: 32px;
        text-align: right;
        height: 88px;
        width: 120px;
        font-size: 28px;
        color: #333;
        padding-right: 32px;
    }
</style>
