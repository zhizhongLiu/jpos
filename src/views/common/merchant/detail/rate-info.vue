<template>
    <scroller>
        <div class="edit-wrap"
            v-if="obj_params.updateStatus === '2'">
            <div class="edit-btn" @click="handleEdit">
                <image class="edit-icon" :src="src_edit"></image>
                <text class="edit-text">{{ is_disabled ? '编辑' : '提交'}}</text>
            </div>
        </div>
        <div v-for="(item, key) in obj_input"
             :key="key">
            <input-fee-cell
                class="cell-item"
                v-if="item.visible !== false"
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
                <div class="radio-box" slot="input_unit" v-if="item.use_radio">
                    <div class="radio-item"
                         @click="handleRadio(item, radio_item)"
                         v-for="(radio_item, radio_index) in item.use_radio" :key="radio_index">
                        <image class="radio-image" :src="item.value === radio_item.value ? src_radio_checked : src_radio_normal"></image>
                        <text class="radio-text" :class="[item.value === radio_item.value && 'radio-text-color']">{{radio_item.text}}</text>
                    </div>
                </div>
                <div slot="input_unit" class="input-unit" v-if="item.unit">
                    <text class="unit-text">{{item.unit}}</text>
                </div>

            </input-fee-cell>
        </div>
    </scroller>
</template>
<script>
    import InputFeeCell             from 'components/merchant/input-fee-cell'
    import ArrowTip                 from 'components/merchant/arrow-tip'
    import Router                   from 'plugins/router'
    import Source                   from 'utils/source.util'
    import DataUtil                 from 'utils/data.util'
    import Api                      from 'api/entry.api'
    import Toast                    from 'helpers/toast'
    import Channel                  from 'plugins/channel'
    import Auth                     from 'helpers/auth'

    export default {
        data () {
            return {
                is_disabled: true,
                src_edit: Source('dtb_details_bianji_icon.png'),
                src_radio_checked: Source('dtb_radio01_checked.png'),
                src_radio_normal: Source('dtb_radio01_normal.png'),
                obj_hidden: {
                    // 是否为对公账户
                    settAccMark: {
                        value: '',
                        visible: false
                    },
                    legalpersonIsSett: {    // 是否非法人
                        value: '',
                        visible: false
                    },
                    // D0收费类型
                    // mercD0FeeTyp: {
                    //     value: '0'
                    // },
                    // // 微信收费类型
                    // wechatFeeTyp: {
                    //     value: '0'
                    // },
                    // // 支付宝收费类型
                    // alipayFeeTyp: {
                    //     value: '0'
                    // },
                    // // 微信收费费率
                    // wechatFee: {
                    //     value: ''
                    // },
                    // // 支付宝收费比率
                    // alipayFee: {
                    //     value: ''
                    // },
                    //基础|其他|最低|最高
                    // D0借记卡手续费
                    d0debitCardFee: {
                        value: ''
                    },
                    // D0贷记卡手续费
                    d0creditCardFee: {
                        value: ''
                    },
                    payments: {
                        value: 'cardpay'
                    },
                },
                obj_input: {
                    dbCardSettFee: {
                        is_margin: true,
                        value: '',
                        label: '商户结算费率(借记卡)',
                        placeholder: '请输入商户结算费率',
                        unit: '%',
                        max_length: 8,
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请输入商户结算费率(借记卡)',
                            },
                        ],
                    },
                    dbMercMaxAmt: {
                        value: '',
                        label: '商户结算封顶费(借记卡)',
                        placeholder: '请输入商户结算封顶费',
                        unit: '元',
                        max_length: 8,
                        use_input_match_type: false,
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请输入商户结算封顶费(借记卡)',
                            },
                        ],
                    },
                    crdCardSettFee: {
                        value: '',
                        label: '商户结算费率(贷记卡)',
                        placeholder: '请输入商户结算费率',
                        max_length: 8,
                        unit: '%',
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请输入商户结算费率(贷记卡)',
                            },
                        ],
                    },
                    // noCardSettFee: {
                    //     value: '',
                    //     label: '无卡交易费率',
                    //     placeholder: '请输入无卡交易费率',
                    //     max_length: 8,
                    //     unit: '%',
                    //     use_check: [
                    //         {
                    //             nonempty: true,
                    //             prompt: '请输入无卡交易费率',
                    //         },
                    //     ],
                    // },
                    settMark: {
                        is_margin: true,
                        value: 'D0',
                        disabled: true,
                        label: '是否为D0业务',
                        max_length: 8,
                        use_input_right: false,
                        use_radio: [
                            {
                                text: '是',
                                value: 'D0',
                            },
                            {
                                text: '否',
                                value: 'T1'
                            },
                        ],
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请选择是否为对公账户',
                            },
                        ],
                    },
                    // mercD0Fee: {
                    //     value: '',
                    //     label: 'D0服务费',
                    //     placeholder: '请输入D0服务费',
                    //     max_length: 8,
                    //     unit: '%',
                    //     use_check: [
                    //         {
                    //             nonempty: true,
                    //             prompt: '请输入D0服务费',
                    //         },
                    //     ],
                    // },
                    // D0结算费率(借记卡)
                    d0FeeDebit1: {
                        value: '',
                        label: 'D0商户结算费率(借记卡)',
                        placeholder: '请输入D0商户结算费率(借记卡)',
                        max_length: 8,
                        unit: '%',
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请输入D0商户结算费率(借记卡)',
                            },
                        ],
                    },
                    // D0结算费率(借记卡)
                    // d0FeeDebit2: {
                    //     value: '',
                    //     label: 'D0商户结算费(借记卡)',
                    //     placeholder: '请输入D0商户结算费',
                    //     unit: '元',
                    //     max_length: 8,
                    //     use_input_match_type: false,
                    //     use_check: [
                    //         {
                    //             nonempty: true,
                    //             prompt: '请输入D0商户结算费(借记卡)',
                    //         },
                    //     ],
                    // },
                    // D0结算封顶(借记卡)
                    // d0MaxDebit: {
                    //     value: '',
                    //     label: 'D0商户结算封顶费(借记卡)',
                    //     placeholder: '请输入D0商户结算封顶费',
                    //     unit: '元',
                    //     max_length: 8,
                    //     use_input_match_type: false,
                    //     use_filter: false,
                    //     use_check: [
                    //         {
                    //             nonempty: true,
                    //             prompt: '请输入D0商户结算封顶费(借记卡)',
                    //         },
                    //     ],
                    // },
                    // D0结算费率(贷记卡)
                    d0FeeCredit1: {
                        value: '',
                        label: 'D0商户结算费率(贷记卡)',
                        placeholder: '请输入D0商户结算费率(贷记卡)',
                        max_length: 8,
                        unit: '%',
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请输入D0商户结算费率(贷记卡)',
                            },
                        ],
                    },
                    // D0结算费率(贷记卡)
                    // d0FeeCredit2: {
                    //     value: '',
                    //     label: 'D0商户结算费(贷记卡)',
                    //     placeholder: '请输入D0商户结算费(贷记卡)',
                    //     unit: '元',
                    //     max_length: 8,
                    //     use_input_match_type: false,
                    //     use_check: [
                    //         {
                    //             nonempty: true,
                    //             prompt: '请输入D0商户结算费(贷记卡)',
                    //         },
                    //     ],
                    // },
                    // D0结算封顶(贷记卡)
                    // d0MaxCredit: {
                    //     value: '',
                    //     label: 'D0商户结算封顶费(贷记卡)',
                    //     placeholder: '请输入D0商户结算封顶费(贷记卡)',
                    //     unit: '元',
                    //     max_length: 8,
                    //     use_input_match_type: false,
                    //     use_check: [
                    //         {
                    //             nonempty: true,
                    //             prompt: '请输入D0商户结算封顶费(贷记卡)',
                    //         },
                    //     ],
                    // },
                },
            }
        },
        props: {
            data: { default: '' },
            obj_params: { default: '' }
        },
        methods: {
            // 初始化数据
            initData () {
                setTimeout(() => {
                    DataUtil.assignmentData(this.data, this.obj_input);
                    DataUtil.assignmentData(this.data, this.obj_hidden);
                    // this.obj_input.dbMercMaxAmt.value = this.obj_input.dbMercMaxAmt.value / 100;
                    // this.obj_input.noCardSettFee.value = this.obj_hidden.wechatFee.value || this.obj_hidden.alipayFee.value;
                    this.judgeType();
                    // this.d0DataConvert();
                },200);
            },
            d0DataConvert() {
                let debit = this.obj_hidden.d0debitCardFee && this.obj_hidden.d0debitCardFee.value.split('|');
                let credit = this.obj_hidden.d0creditCardFee && this.obj_hidden.d0creditCardFee.value.split('|');
                this.obj_input.d0FeeDebit1.value = debit[0];
                this.obj_input.d0FeeCredit1.value = credit[0];

            },
            // 赋值
            handleInput(item, key, event) {
                item.value = event.value;
                // if (key === 'noCardSettFee') this.judgeNoCardFee();
            },

            // 判断无卡费率
            judgeNoCardFee () {
                this.obj_hidden.wechatFee.value = this.obj_input.noCardSettFee.value;
                this.obj_hidden.alipayFee.value = this.obj_input.noCardSettFee.value;
            },

            // 判断D0页面
            judgeType() {
                let type = this.obj_input.settMark.value === 'D0';
                // this.obj_input.mercD0Fee.visible = type;    // D0服务费
                this.obj_input.d0FeeDebit1.visible = type;
                this.obj_input.d0FeeCredit1.visible = type;

                if (type) return;

                this.obj_input.d0FeeDebit1.value = '';
                this.obj_input.d0FeeCredit1.value = '';
            },

            // 编辑
            handleEdit () {
                if (this.is_disabled) return this.is_disabled = false;
                // D0结算不支持对公账户结算, 不支持非法人 只支持法人
                if (this.obj_input.settMark.value === 'D0' && (this.obj_hidden.settAccMark.value === '0' || this.obj_hidden.legalpersonIsSett.value === 'Y'))  {
                    console.log('11111')
                    return Toast('D0结算只支持法人结算');
                }
                // 检测
                let options = {
                    ...this.obj_input,
                    ...this.obj_hidden,
                };
                if (DataUtil.checkData(options)) return null;
                // 过滤
                options = DataUtil.filterData(options);

                if (!DataUtil.checkDataChange(this.data, options)) {
                    return this.is_disabled = true;
                }
                let d0Debit = this.obj_input.d0FeeDebit1.value + '|0|0|0'
                options.d0debitCardFee = d0Debit;
                let d0Credit = this.obj_input.d0FeeCredit1.value + '|0|0|0'
                options.d0creditCardFee = d0Credit;
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
                let feeData = options.feeData || {};
                feeData.creditCard = { ...fee, ...(feeData.creditCard && feeData.creditCard), basisRate: options.crdCardSettFee };
                feeData.debitCard = { ...fee, ...(feeData.debitCard && feeData.debitCard), basisRate: options.dbCardSettFee, highestAmount: (options.dbMercMaxAmt - 0) * 10000 / 100 + '' };
                feeData.creditCard_D0 = { ...fee, ...(feeData.creditCard_D0 && feeData.creditCard_D0), basisRate: options.d0FeeCredit1 };
                feeData.debitCard_D0 = { ...fee, ...(feeData.debitCard_D0 && feeData.debitCard_D0), basisRate: options.d0FeeDebit1 };
                // console.log(feeData);
                options.feeData = feeData;

                if (options.settMark === 'T1') {
                    // options.body.mercD0FeeTyp && delete options.body.mercD0FeeTyp;
                    // options.body.mercD0Fee && delete options.body.mercD0Fee;
                    options.d0debitCardFee && delete options.d0debitCardFee;
                    options.d0creditCardFee && delete options.d0creditCardFee;
                    options.feeData.creditCard_D0 && delete options.feeData.creditCard_D0;
                    options.feeData.debitCard_D0 && delete options.feeData.debitCard_D0;
                }
                console.log(options);
                this.submitData(options);
            },

            // 提交数据
            submitData (opt) {
                Auth.getToken().then((info) => {
                    let options = {
                        method: 'POST',
                        body: {
                            token: info.token,
                            mercCode: this.obj_params.customerId,
                            agtMercId: ( info.cpos && info.cpos.agentId  ) || (info.jfbpos && info.jfbpos.agentId) || '',   // 代理商ID可传可不传
                            uptType: '2',
                            productType: 'jfbpos',
                            ...opt,
                        },
                        loading: true
                    };
                    return Api.updateMerchantInfo(options).then(result => {
                        let { code, msg } = result;
                        if (code !== '0000') throw msg;
                        Channel.post('$$RefreshList', {});
                        Toast(msg);
                        Router.pop();
                    }).catch(error => {
                        Toast(error)
                    });
                })
            },

            // 单选事件
            handleRadio(item, radio_item) {
                if (this.is_disabled) return null;
                if (item.disabled) return null;
                if ((this.obj_hidden.settAccMark.value === '0' || this.obj_hidden.legalpersonIsSett.value === 'Y') && radio_item.value === 'D0') return null;
                item.value = radio_item.value;
                // let type = item.value === 'D0';
                // this.obj_input.mercD0Fee.value = type ? this.obj_input.mercD0Fee.value : '0';
                // this.obj_input.mercD0Fee.visible = type;
                // this.obj_hidden.mercD0FeeTyp.value = '';
                this.judgeType();
            },
        },
        components: {
            InputFeeCell,
            ArrowTip,
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
    .edit-wrap{
        height: 88px;
        flex-direction: row;
        align-items: center;
        padding-right: 30px;
        justify-content: flex-end;
        background-color: #fff;
        border-bottom-width: 1px;
        border-color: #ddd;
    }
    .edit-btn{
        flex-direction: row;
    }
    .edit-icon{
        width: 40px;
        height: 40px;
    }
    .edit-text{
        font-size: 28px;
        color: #F97C35;
        margin-left: 20px;
    }
</style>
