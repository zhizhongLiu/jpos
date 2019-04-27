<template>
    <div class="wrap">
        <div class="edit-wrap"
             v-if="obj_params.updateStatus === '2'">
            <div class="edit-btn" @click="handleEdit">
                <image class="edit-icon" :src="src_edit"></image>
                <text class="edit-text">{{ is_disabled ? '编辑' : '提交'}}</text>
            </div>
        </div>
        <scroller class="wrap">
            <template v-for="(item, key) in obj_input">
                <div :key="key">
                    <wow-input-cell
                        v-if="key !== 'mercRegAddr' && item.visible !== false"
                        class="cell-item"
                        @click="handleSelect(item.label, item)"
                        :input_value="item.value | filterField( item.filter_type, is_disabled || item.disabled)"
                        :input_max_length="item.max_length"
                        :input_placeholder="item.placeholder"
                        :input_label_txt="item.label"
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
                                 @click="handleRadio(item, radio_item, key)"
                                 v-for="(radio_item, radio_index) in item.use_radio">
                                <image class="radio-image" :src="item.value === radio_item.value ? src_radio_checked : src_radio_normal"></image>
                                <text class="radio-text" :class="[item.value === radio_item.value && 'radio-text-color']">{{radio_item.text}}</text>
                            </div>
                        </div>
                        <div slot="input_other"
                             class="input-unit"
                            v-if="key === 'noCardSettFee'">
                            <text class="unit-text">{{item.unit}}</text>
                        </div>
                    </wow-input-cell>
                </div>

                <div v-if="key === 'mercRegAddr'" class="text-area" :key="key">
                    <text class="text-area-label">{{item.label}}</text>
                    <wow-text-area
                        :text_value="item.value"
                        :text_disabled="is_disabled"
                        @input="handleInput(item, key, $event)"
                        :text_placeholder="item.placeholder"
                        text_border_color="#fff">
                    </wow-text-area>
                </div>
            </template>
            <image-upload :image_arr="obj_image" :image_disabled="is_disabled" :merc_mbl="obj_input.mercMbl.value"></image-upload>
        </scroller>
    </div>
</template>
<script>
    import WowInputCell             from 'wow-weex/lib/wow-input-cell'
    import WowTextArea              from 'wow-weex/lib/wow-text-area'
    import WowButton                from 'wow-weex/lib/wow-button'
    import ArrowTip                 from 'components/merchant/arrow-tip'
    import Router                   from 'plugins/router'
    import Source                   from 'utils/source.util'
    import ImageUpload              from 'components/merchant/image-upload'
    import DataUtil                 from 'utils/data.util'
    import RegularUtil              from 'utils/regular.util'
    import Api                      from 'api/entry.api'
    import Toast                    from 'helpers/toast'
    import Loading                  from 'plugins/loading'
    import Picker                   from 'plugins/picker'
    import Channel                  from 'plugins/channel'
    import Auth                     from 'helpers/auth'
    import EntryMixin               from 'mixins/merchant.mixin'

    const $$SELECT_MCC = '$$SELECT_MCC';

    export default{
        mixins: [EntryMixin],
        data () {
            return {
                is_disabled: true,
                src_edit: Source('dtb_details_bianji_icon.png'),
                src_radio_checked: Source('dtb_radio01_checked.png'),
                src_radio_normal: Source('dtb_radio01_normal.png'),
                obj_image: {
                    // 法人身份证正面照
                    crpAboveImg: {
                        value: '',
                        label: '法人身份证正面照',
                        src: '',
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请选择法人身份证正面照',
                            }
                        ]
                    },
                    // 法人身份证反面照
                    crpBelovImg: {
                        value: '',
                        label: '法人身份证反面照',
                        src: '',
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请选择法人身份证反面照',
                            }
                        ]
                    },
                    // 法人持证照
                    crpHoldImg: {
                        value: '',
                        label: '法人持证照',
                        src: '',
                        disabled: true,
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请选择法人持证照',
                            }
                        ]
                    },
                    receiptProImg1: {
                        value: '',
                        label: '收单协议照1',
                        src: '',
                        type: 'sum',
                        use_filter: false,
                        disabled: true,
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请选择收单协议照1',
                            }
                        ]
                    },
                    receiptProImg2: {
                        value: '',
                        label: '收单协议照2',
                        src: '',
                        type: 'sum',
                        use_filter: false,
                        disabled: true,
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请选择收单协议照2',
                            }
                        ]
                    },
                    receiptProImg3: {
                        value: '',
                        label: '收单协议照3',
                        src: '',
                        type: 'sum',
                        use_filter: false,
                        disabled: true,
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请选择收单协议照3',
                            }
                        ]
                    },
//                    receiptProImg4: {
//                        value: '',
//                        label: '收单协议照4',
//                        src: '',
//                        type: 'sum',
//                        use_filter: false,
//                        use_check: [
//                            {
//                                nonempty: true,
//                                prompt: '请选择收单协议照4',
//                            }
//                        ]
//                    },
                    // 营业执照
                    busiLicenseImg: {
                        value: '',
                        label: '营业执照',
                        src: '',
                    },
                    // 收银台照
                    cashDeskImg: {
                        value: '',
                        label: '收银台照',
                        src: '',
                    },
                    // 经营场景照
                    busiPlaceImg: {
                        value: '',
                        label: '经营场景照',
                        src: '',
                    },
                    // 门头照
                    busiDoorImg: {
                        value: '',
                        label: '门头照',
                        src: '',
                    },
                    // 其它
                    otherImg1: {
                        value: '',
                        label: '其它',
                        src: '',
                    },
                },
                obj_hidden: {
                    // 是否现场注册
                    sceneReg: {
                        value: 'N'
                    },
                    // 法人代表证件类型
                    certificType: {
                        value: '00',
                    },
                    // 协议到期日期
                    expDt: {
                        value: ''
                    },
                    // 微信ID
                    // wechatId: {
                    //     value: ''
                    // },
                    // MCC码
                    mercTypeMCC: {
                        value: '',
                    },
                    // 商户归属省市名称
                    mercProvName : {
                        value: '',
                    },
                    // 商户归属省市码
                    mercProv: {
                        value: '',
                    },
                    // 商户归属市/县名
                    mercCityName: {
                        value: '',
                    },
                    // 商户归属市/县
                    mercCity: {
                        value: '',
                    },
                    // 商户级别
                    mercLevl: {
                        value: '',
                    },
                    // 商户业务代码
                    payments: {
                        value: 'cardpay'
                    },
                    // 收单协议照
                    receiptProImg: {
                        value: '',
                    },
                },
                obj_input: {
                    mercMbl: {
                        is_margin: true,
                        value: '',
                        label: '用户手机号',
                        placeholder: '请输入手机号',
                        type: 'tel',
                        max_length: 11,
                        filter_type: 'phone',
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请输入用户手机号',
                            },
                            {
                                rule: RegularUtil.isPhone,
                                prompt: '用户手机号输入有误',
                            },
                        ],
                    },
                    certificNm: {
                        is_margin: true,
                        value: '',
                        label: '法人代表姓名',
                        placeholder: '请输入法人姓名',
                        max_length: 15,
                        disabled: false,
                        filter_type: 'name',
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请输入法人代表姓名',
                            },
                        ],
                    },
                    certificNo: {
                        value: '',
                        label: '法人代表证件号码',
                        placeholder: '请输入法人证件号码',
                        max_length: 18,
                        disabled: true,
                        filter_type: 'certPid',
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请输入法人代表证件号码',
                            },
                            {
                                rule: RegularUtil.isIDCard,
                                prompt: '法人代表证件号码输入有误',
                            },
                        ],
                    },
                    mercCnm: {
                        is_margin: true,
                        value: '',
                        label: '商户名称',
                        placeholder: '请输入商户名称',
                        max_length: 30,
                        disabled: true,
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请输入商户名称',
                            },
                        ],
                    },
                    mercAbbr: {
                        value: '',
                        label: '商户简称',
                        placeholder: '请输入商户简称',
                        max_length: 30,
                        disabled: true,
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请输入商户简称',
                            },
                        ],
                    },
                    // 2019-03-15
                    // 去掉英文名字段
                    // 需求编号：PROD2019031200003800
//                    mercEnglishNm: {
//                        value: '',
//                        label: '商户英文名',
//                        placeholder: '请输入商户英文名',
//                        max_length: 30,
//                        use_check: [
//                            {
//                                nonempty: true,
//                                prompt: '请输入商户英文名',
//                            },
//                        ],
//                    },
                    mercTypeMCCName: {
                        value: '',
                        label: 'MCC码',
                        placeholder: '请选择MCC码',
                        use_arrow: true,
                        use_input: false,
                        disabled: true,
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请选择MCC码',
                            },
                        ],
                    },
                    mercArea: {
                        value: '',
                        label: '所属地区',
                        placeholder: '请选择省市',
                        use_arrow: true,
                        use_input: false,
                        disabled: true,
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请选择所属地区',
                            },
                        ],
                    },
                    // weChat: {
                    //     value: true,
                    //     label: '是否开通微信支付',
                    //     use_input: false,
                    //     use_input_right: false,
                    //     use_radio: [
                    //         {
                    //             text: '是',
                    //             value: true,
                    //         },
                    //         {
                    //             text: '否',
                    //             value: false
                    //         },
                    //     ],
                    //     use_check: [
                    //         {
                    //             nonempty: true,
                    //             prompt: '是否开通微信支付',
                    //         },
                    //     ],
                    // },
                    // aliPay: {
                    //     value: true,
                    //     label: '是否开通支付宝支付',
                    //     use_input: false,
                    //     use_input_right: false,
                    //     use_radio: [
                    //         {
                    //             text: '是',
                    //             value: true,
                    //         },
                    //         {
                    //             text: '否',
                    //             value: false
                    //         },
                    //     ],
                    //     use_check: [
                    //         {
                    //             nonempty: true,
                    //             prompt: '是否开通微信支付',
                    //         },
                    //     ],
                    // },
                    // contactPhone: {
                    //     value: '',
                    //     label: '客服电话',
                    //     placeholder: '请输入客服电话',
                    //     type: 'tel',
                    //     max_length: 11,
                    //     visible: true,
                    //     use_check: [
                    //         {
                    //             nonempty: true,
                    //             prompt: '请输入客服电话',
                    //         },
                    //     ],
                    // },
                    // noCardSettFee: {
                    //     value: '',
                    //     label: '无卡交易费率',
                    //     placeholder: '请输入无卡交易费率',
                    //     max_length: 8,
                    //     unit: '%',
                    //     visible: false,
                    //     use_check: [
                    //         {
                    //             nonempty: true,
                    //             prompt: '请输入无卡交易费率',
                    //         },
                    //     ],
                    // },
                    crpEffStartDt: {
                        value: '',
                        label: '身份证开始有效期',
                        placeholder: '请选择身份证开始有效期',
                        use_arrow: true,
                        use_input: false,
                        visible: true,
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请选择身份证开始有效期',
                            },
                        ],
                    },
                    crpEffEndDt: {
                        value: '',
                        label: '身份证结束有效期',
                        placeholder: '请选择身份证结束有效期',
                        use_arrow: true,
                        use_input: false,
                        visible: true,
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '身份证结束有效期必须大于开始有效期',
                                type: 'date',
                                gt: 'crpEffStartDt'
                            },
                        ],
                    },
                    // productType: {
                    //     value: 'jfbpos',
                    //     label: '选择开通',
                    //     use_input: false,
                    //     use_input_right: false,
                    //     disabled: false,
                    //     use_radio: [
                    //         {
                    //             text: '即付宝POS',
                    //             value: 'jfbpos',
                    //         },
                    //         {
                    //             text: '大POS',
                    //             value: 'cpos'
                    //         },
                    //     ],
                    //     use_check: [
                    //         {
                    //             nonempty: true,
                    //             prompt: '请选择开通类型',
                    //         },
                    //     ],
                    // },
                    effDt: {
                        value: '',
                        label: '协议开始日期',
                        placeholder: '请输入协议开始日期',
                        max_length: 25,
                        use_arrow: true,
                        use_input: false,
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请输入协议开始日期',
                            }
                        ],
                    },
                    busRegNo: {
                        value: '',
                        label: '商户营业执照号',
                        placeholder: '请输入营业执照号',
                        max_length: 25,
                        use_check: [
//                            {
//                                nonempty: true,
//                                prompt: '请输入商户营业执照号',
//                            },
                            {
                                rule: /^[a-zA-Z0-9]{1,25}$/,
                                prompt: '商户营业执照号输入错误',
                            }
                        ],
                    },
                    busRegStartDt: {
                        value: '',
                        label: '营业执照开始日期',
                        placeholder: '请输入营业执照开始日期',
                        max_length: 25,
                        use_arrow: true,
                        use_input: false,
                        use_check: [
//                            {
//                                nonempty: true,
//                                prompt: '请输入营业执照开始日期',
//                            }
                        ],
                    },
                    busRegEndDt: {
                        value: '',
                        label: '营业执照结束日期',
                        placeholder: '请输入营业执照结束日期',
                        max_length: 25,
                        use_arrow: true,
                        use_input: false,
                        use_check: [
                            {
//                                nonempty: true,
                                prompt: '营业执照结束日期必须大于开始日期',
                                type: 'date',
                                gt: 'busRegStartDt'
                            }
                        ],
                    },
                    mercRegAddr: {
                        value: '',
                        label: '经营地址',
                        placeholder: '请输入营业地址',
                        max_length: 30,
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请输入营业地址',
                            },
                        ],
                    }
                },
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
                Channel.add($$SELECT_MCC, this.channelSelectMccHandle.bind(this));
            },
            // 销毁事件
            disMonitorEvent () {
                Channel.remove($$SELECT_MCC);
            },
            // 选择MCC监听处理
            channelSelectMccHandle (item = {}) {
                let { name, code } = item;
                this.obj_input.mercTypeMCCName.value = name;
                this.obj_hidden.mercTypeMCC.value = code;
            },

            // 初始化数据
            initData () {
                setTimeout(() => {
                    DataUtil.assignmentData(this.data, this.obj_input);
                    DataUtil.assignmentData(this.data, this.obj_image);
                    DataUtil.assignmentData(this.data, this.obj_hidden);

                    // this.initNocardStatus();

                    // if (this.data.busiLicenseImg) {
                    //     this.obj_image.busiLicenseImg.disabled = true;
                    // }
                    this.data.busiLicenseImg && (this.obj_image.busiLicenseImg.disabled = true);
                    this.obj_input.busRegStartDt.value ? (this.obj_input.busRegStartDt.disabled = true) : (this.obj_input.busRegStartDt.disabled = false);
                    this.obj_input.busRegEndDt.value ? (this.obj_input.busRegEndDt.disabled = true) : (this.obj_input.busRegEndDt.disabled = false);
                    if (this.data.receiptProImg) {
                        let arr = this.data.receiptProImg.split('|');
                        this.obj_image.receiptProImg1.value = arr[0];
                        this.obj_image.receiptProImg2.value = arr[1];
                        this.obj_image.receiptProImg3.value = arr[2];
//                        this.obj_image.receiptProImg4.value = arr[3];
                    }
                },200);
            },
            // 初始化无卡支付时其他字段显示状态
            initNocardStatus() {
                let type = (this.obj_input.weChat.value || this.obj_input.aliPay.value);
                this.obj_input.contactPhone.visible = type;
                this.obj_input.crpEffStartDt.visible = type;
                this.obj_input.crpEffEndDt.visible = type;
            },
            // 编辑
            handleEdit () {
                if (this.is_disabled) return this.is_disabled = false;

                // let start = this.obj_input.crpEffStartDt.value;
                // let end = this.obj_input.crpEffEndDt.value;
                // if (start && end && start >= end) {
                //     return Toast('身份证件有效开始日期大于身份证件证件有效截止日期')
                // }
                // let payments = this.obj_hidden.payments.value;
                // if (this.obj_input.weChat.value || this.obj_input.aliPay.value) {
                //     payments.indexOf('qrpay') <= -1 && (this.obj_hidden.payments.value = payments + ',qrpay');
                // } else {
                //     payments.indexOf('qrpay') > -1 && (this.obj_hidden.payments.value = payments.replace(',qrpay', ''));
                // }
                this.obj_hidden.payments.value = 'cardpay';
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
                // if (!options.aliPay && !options.weChat) {
                //     delete options.contactPhone;
                //     delete options.crpEffStartDt;
                //     delete options.crpEffEndDt;
                // }

                let levl = options.busiLicenseImg && options.cashDeskImg && options.busiPlaceImg && options.busiDoorImg && options.otherImg1;
                options.mercLevl = levl ? '1' : this.data.mercLevl;
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
                            uptType: '3',
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
            handleInput (item, key, event) {
                if (this.is_disabled) return;
                if (key === 'mercRegAddr') {
                    this.obj_input.mercRegAddr.value = this.utf16toEntities(event.value);
                    return;
                }
                item.value = event.value;
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
            // 单选事件
            handleRadio (item, radio_item, key) {
                // if (this.is_disabled || item.disabled) return null;
                // if (key === 'productType') {
                //     return this.judgeUserAuth(item, radio_item.value)
                // }
                // item.value = radio_item.value;
                // this.openNoCard(key, item.value);
            },
            // 判断业务员权限，开通
            judgeUserAuth(item, value) {
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
            // 是否开通无卡
            openNoCard (key, value) {
                if (key === 'aliPay' || key === 'weChat') {
                    this.initNocardStatus();
                }
                if ((key === 'aliPay' || key === 'weChat') && (!this.data.aliPay && !this.data.weChat)) {
                    let type = (this.obj_input.weChat.value || this.obj_input.aliPay.value);
                    this.obj_input.noCardSettFee.visible = type;
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
                    payments.indexOf('wechat') > -1 && (this.obj_hidden.payments.value =  payments.replace(',wechat', ''));
                }
            },

            // 选择事件
            handleSelect (text, item) {
                console.log(text)
                switch (text) {
                    case 'MCC码':
                        this.handleJump('common_merchant_mcc');
                        break;
                    case '所属地区':
                        this.popCity();
                        break;
                    case '身份证开始有效期':
                    case '身份证结束有效期':
                    case '营业执照开始日期':
                    case '营业执照结束日期':
                        this.popDate(item);
                        break;
                    case '协议开始日期':
                        this.popDate(item, 'effDt');
                        break;
                }
            },
            popDate(item, type) {
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
            WowButton,
            ImageUpload,
        },
    }
</script>
<style>
    .wrap{
        flex: 1;
    }
    .cell-item{
        background-color: #fff;
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
    .input-unit{
        width: 40px;
        height: 40px;
        justify-content: center;
        margin-right: 32px;
    }
    .unit-text{
        font-size: 28px;
        color: #3A3A3A;
        text-align: center;
    }
</style>
