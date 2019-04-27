<template>
    <div class="wrap">
        <div class="edit-wrap" v-if="obj_params.updateStatus === '2'">
            <div class="edit-btn" @click="handleEdit">
                <image class="edit-icon" :src="src_edit"></image>
                <text class="edit-text">{{ is_disabled ? '编辑' : '提交'}}</text>
            </div>
        </div>
        <scroller>
            <template v-for="(item, key) in obj_input">
                <div :key="key">
                    <wow-input-cell
                        v-if="key !== 'mercAuditRemark' && item.visible !== false"
                        class="cell-item"
                        @click="handleSelect(item.label)"
                        :input_value="item.value | filterField( item.filter_type, is_disabled || item.disabled)"
                        :input_placeholder="item.placeholder"
                        :input_label_txt="item.label"
                        :input_max_length="item.max_length"
                        :input_type="item.type"
                        :input_disabled="is_disabled || item.disabled"
                        :input_use="item.use_input !== false"
                        :input_use_right="item.use_input_right !== false"
                        :key="key"
                        @input="handleInput(item, key, $event)">
                        <arrow-tip slot="input_unit" v-if="item.use_arrow && !is_disabled"></arrow-tip>
                        <div class="radio-box" slot="input_unit" v-if="item.use_radio">
                            <div class="radio-item"
                                :key="radio_index"
                                 @click="handleRadio(item, radio_item)"
                                 v-for="(radio_item, radio_index) in item.use_radio">
                                <image class="radio-image" :src="item.value === radio_item.value ? src_radio_checked : src_radio_normal"></image>
                                <text class="radio-text" :class="[item.value === radio_item.value && 'radio-text-color']">{{radio_item.text}}</text>
                            </div>
                        </div>
                    </wow-input-cell>
                </div>
                <div v-if="key === 'mercAuditRemark'" class="text-area" :key="key">
                    <text class="text-area-label">{{item.label}}</text>
                    <wow-text-area
                        :text_value="item.value"
                        :text_max_lenght="item.max_length"
                        @input="handleInput(item, key, $event)"
                        :text_placeholder="item.placeholder"
                        text_border_color="#fff">
                    </wow-text-area>
                </div>
            </template>
            <image-upload :image_arr="obj_image" :image_disabled="is_disabled" :merc_mbl="data.mercMbl"></image-upload>
            <text class="prompt">{{str_prompt}}</text>
        </scroller>
    </div>
</template>
<script>
    import WowInputCell             from 'wow-weex/lib/wow-input-cell'
    import WowTextArea              from 'wow-weex/lib/wow-text-area'
    import ArrowTip                 from 'components/merchant/arrow-tip'
    import Router                   from 'plugins/router'
    import Source                   from 'utils/source.util'
    import ImageUpload              from 'components/merchant/image-upload'
    import DataUtil                 from 'utils/data.util'
    import Api                      from 'api/entry.api'
    import Toast                    from 'helpers/toast'
    import Loading                  from 'plugins/loading'
    import Picker                   from 'plugins/picker'
    import Channel                  from 'plugins/channel'
    import Auth                     from 'helpers/auth'
    import EntryMixin               from 'mixins/merchant.mixin'

    const $$SELECT_BANK = '$$SELECT_BANK';
    const $$SELECT_BRANCH = '$$SELECT_BRANCH';

    export default {
        mixins: [EntryMixin],
        data () {
            return {
                is_disabled: true,
                src_edit: Source('dtb_details_bianji_icon.png'),
                src_radio_checked: Source('dtb_radio01_checked.png'),
                src_radio_normal: Source('dtb_radio01_normal.png'),
                obj_hidden: {
                    // D0类型
                    settMark: {
                        value: '',
                        visible: false
                    },
                    //市区代码
                    city_cd: {
                        value: '',
                    },
                    //银行代码
                    bank_cd: {
                        value: '',
                    },
                    // 支行信息联行行号
                    lankNo: {
                        value: '',
                    },
                    // 法人代表姓名
                    certificNm: {
                        value: '',
                    },
                    // 法人代表身份证号
                    certificNo: {
                        value: '',
                    },
                    // 法人手机号
                    mercMbl: {
                        value: '',
                    },
                    // weChat: {
                    //     value: true,
                    // },
                    legalpersonIsSett: {
                        value: 'N',
                    },

                    // 商户等级
                    mercLevl: {
                        value: ''
                    },
                    // 营业执照
                    busRegNo: {
                        value: ''
                    },
                },
                obj_image: {
                    // 银行卡正面照
                    bankAboveImg: {
                        value: '',
                        label: '银行卡正面照',
                        src: '',
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请选择银行卡正面照',
                            }
                        ]
                    },
                    // 结算授权书(选填)
                    // settleProImg: {
                    //     value: '',
                    //     label: '结算授权书',
                    //     src: '',
                    //     visible: false,
                    //     use_check: [
                    //         {
                    //             nonempty: true,
                    //             prompt: '请选择结算授权书照',
                    //         }
                    //     ]
                    // },
                    // 身份证正面照
                    settCrpAboveImg: {
                        value: '',
                        label: '结算人身份证正面照',
                        src: '',
                        visible: false,
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请选择结算人身份证正面照',
                            }
                        ]
                    },
                    // 身份证反面照
                    settCrpBelovImg: {
                        value: '',
                        label: '结算人身份证反面照',
                        src: '',
                        visible: false,
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请选择结算人身份证反面照',
                            }
                        ]
                    },
                    // 非法人授权书
                    nonCrpNmSettleProImg: {
                        value: '',
                        label: '非法人授权书',
                        visible: false,
                        src: '',
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请选择非法人授权书',
                            }
                        ]
                    },
                    // 其他
                    otherImg2: {
                        value: '',
                        label: '其它',
                        src: '',
                    },
                },
                obj_input: {
                    settAccount: {
                        is_margin: true,
                        value: '',
                        label: '银行卡号',
                        placeholder: '请输入银行卡号',
                        max_length: 25,
                        filter_type: 'card',
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请输入银行卡号',
                            },
                            {
                                rule: /^[0-9]{1,25}$/,
                                prompt: '银行卡号输入错误',
                            },
                        ],
                    },
                    settBankNm: {
                        value: '',
                        label: '银行名称',
                        placeholder: '请选择银行',
                        use_input: false,
                        use_arrow: true,
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请选择银行名称',
                            }
                        ],
                    },
                    openAccountAddress: {
                        value: '',
                        label: '开户地',
                        placeholder: '请选择省市',
                        use_input: false,
                        use_arrow: true,
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请选择开户地',
                            }
                        ],
                    },
                    bankBranchName: {
                        value: '',
                        label: '支行信息',
                        placeholder: '请选择支行信息',
                        use_input: false,
                        use_arrow: true,
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请选择支行信息',
                            }
                        ],
                    },
                    settAccMark: {
                        is_margin: true,
                        value: '0',
                        label: '是否为对公账户',
                        use_input_right: false,
                        disabled: true,
                        use_radio: [
                            {
                                text: '是',
                                value: '0',
                            },
                            {
                                text: '否',
                                value: '1'
                            },
                        ],
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请选择是否为对公账户',
                            },
                        ],
                    },
                    settAccNm: {
                        value: '',
                        label: '账户名',
                        placeholder: '请填写账户名',
                        max_length: 20,
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请填写账户名',
                            }
                        ],
                    },// 银行预留手机号
                    bankMbl: {
                        value: '',
                        label: '结算账户预留手机号',
                        placeholder: '请填写结算账户预留手机号',
                        max_length: 20,
                        filter_type: 'phone',
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请填写结算账户预留手机号',
                            }
                        ],
                    },
                    // 身份证号
                    settCrpNo: {
                        value: '',
                        label: '结算人身份证号',
                        placeholder: '请填写结算人身份证号',
                        max_length: 20,
                        filter_type: 'certPid',
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请填写结算人身份证号',
                            }
                        ],
                    },
                    // wechatId: {
                    //     value: '',
                    //     label: '微信号',
                    //     placeholder: '请填写微信号',
                    //     max_length: 20,
                    //     visible: false,
                    //     use_check: [
                    //         {
                    //             nonempty: true,
                    //             prompt: '请填写微信号',
                    //         }
                    //     ],
                    // },
                    mercAuditRemark: {
                        value: '',
                        label: '商户审批备注',
                        placeholder: '请填写备注',
                        max_length: 30,
                    }
                },
                str_prompt: `温馨提示：\n企业类商户若结算授权书未盖公章，必须补充以下四项之一：租赁协议、结算人手持执照原件照片、法人和结算人身份证正面合照、法人和结算人合照。`
            }
        },
        props: {
            data: { default: '' },
            obj_params: { default: '' },
        },
        created () {
            // 监听事件
            this.monitorEvent();
        },
        methods: {

            // 监听事件
            monitorEvent () {
                Channel.add($$SELECT_BANK, this.channelSelectBankHandle.bind(this));
                Channel.add($$SELECT_BRANCH, this.channelSelectBranchHandle.bind(this));
            },

            // 销毁事件
            disMonitorEvent () {
                Channel.remove($$SELECT_BANK);
                Channel.remove($$SELECT_BRANCH);
            },

            // 选择银行监听
            channelSelectBankHandle (item = {}) {
                let { bank_name, short_bank_no } = item;
                this.obj_input.settBankNm.value = bank_name;
                this.obj_hidden.bank_cd.value = short_bank_no;
            },

            // 选择支行监听
            channelSelectBranchHandle (item = {}) {
                let { bankName, bankNo } = item;
                this.obj_input.bankBranchName.value = bankName;
                this.obj_hidden.lankNo.value = bankNo;
            },

            // 初始化数据
            initData () {
                setTimeout(() => {
                    DataUtil.assignmentData(this.data, this.obj_input);
                    DataUtil.assignmentData(this.data, this.obj_image);
                    DataUtil.assignmentData(this.data, this.obj_hidden);

                    this.queryCardBin(this.obj_input.settAccount.value, true);
                    // if (!this.obj_input.settCrpNo.value || !this.obj_input.bankMbl.value) {
                    //     this.obj_input.settCrpNo.value = this.obj_hidden.certificNo.value || '';    // 结算人身份证号
                    //     this.obj_input.bankMbl.value = this.obj_hidden.mercMbl.value || '';  // 银行预留手机号
                    // }
                    this.isPrivate();
                    this.isLegalpersonIsSett();
                    // if (this.obj_input.settAccMark.value !== '0' && this.obj_hidden.crpNm.value !== this.data.settAccNm) {
                    //     this.obj_input.wechatId.visible = true;
                    // }
                    // if (this.obj_input.settAccMark.value !== '0' && this.obj_hidden.weChat.value) {
                    //     this.obj_input.wechatId.visible = true;
                    // }
                },200);
            },
            isPrivate() {
                let type = this.obj_input.settAccMark.value === '0';
                this.obj_input.settCrpNo.visible = !type;
                this.obj_input.bankMbl.visible = !type;
                this.obj_input.settCrpNo.use_filter = !type;
                this.obj_input.bankMbl.use_filter = !type;
            },
            // 编辑
            handleEdit () {
                if (this.is_disabled) return this.is_disabled = false;
                if (this.obj_hidden.settMark.value === 'D0' && (this.obj_input.settAccMark.value === '0' || this.obj_hidden.legalpersonIsSett.value === 'Y'))  {
                    return Toast('当前账户不支持D0业务');
                }
                // 检测
                let options = {
                    ...this.obj_input,
                    ...this.obj_image,
                    ...this.obj_hidden
                };
                if (DataUtil.checkData(options)) return null;
                // 过滤
                options = DataUtil.filterData(options);
                if (!DataUtil.checkDataChange(this.data, options)) {
                    return this.is_disabled = true;
                }
                console.log(options);
                this.submitData(options)
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
                            uptType: '1',
                            productType: 'jfbpos',
                            ...opt,
                        },
                        loading: true
                    };
                    Api.updateMerchantInfo(options).then((result) => {
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

            // 赋值
            handleInput(item, key, event) {
                if (this.is_disabled) return;    // 不能编辑时不掉接口
                if (key === 'mercAuditRemark') {
                    this.obj_input.mercAuditRemark.value = this.utf16toEntities(event.value);
                    return;
                }
                item.value = event.value;
                // if (key === 'settAccNm' && this.obj_input.settAccMark.value !== '0') {
                //     var type = this.obj_hidden.crpNm.value !== event.value;
                //     this.obj_input.wechatId.visible = type;
                // }

                if (key === 'settCrpNo') {
                    this.isLegalpersonIsSett(true);
                }
                if (key !== 'settAccount') return;
                this.obj_input.settBankNm.value = '';
                this.obj_hidden.bank_cd.value = '';
                // clearTimeout(this.obj_timer);
                // this.obj_timer = setTimeout(() => {
                    this.queryCardBin(item.value);
                // }, 1000)
            },
            utf16toEntities(str) {
                var patt = /[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则
                str = str.replace(patt, function (char) {
                    var H = '', L = '', code = '';
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

            // 单选事件
            handleRadio (item, radio_item) {
                if (this.is_disabled) return null;
                if (item.disabled) return null;
                item.value = radio_item.value;
                //                this.obj_input.settAccNm.value = '';
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
            // 选择事件
            handleSelect (text) {
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
            popOpenAddress () {
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

            // 跳转页面
            handleJump (page, data = {}) {
                Router.push(page, data)
            },

        },
        // 页面销毁
        destroyed () {
            // 销毁监听事件
            this.disMonitorEvent();
        },
        components: {
            WowInputCell,
            ArrowTip,
            WowTextArea,
            ImageUpload,
        }
    }
</script>
<style>
    .prompt{
        line-height: 34px;
        padding-left: 30px;
        padding-right: 30px;
        font-size: 24px;
        color: #949494;
    }
    .cell-item{
        background-color: #fff;
    }
    .margin{
        margin-top: 20px;
    }
    .text-area{
        background-color: #fff;
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
