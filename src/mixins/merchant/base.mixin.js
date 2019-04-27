import RegularUtil              from 'utils/regular.util'
const data = () => {
    return {
        obj_hidden: {

            receiptProImg1: {
                value: '',
                label: '收单协议照1',
            },
            receiptProImg2: {
                value: '',
                label: '收单协议照2',
            },
            receiptProImg3: {
                value: '',
                label: '收单协议照3',
            },

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
            // // 微信ID
            // wechatId: {
            //     value: ''
            // },
            // 商户交易跳转标识
            mercMark: {
                value: '001'
            },
            // 证件类型
            benefitCrpType: {
                value: '00',
            },
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
                value: '3',
            },
            // 是否生成终端信息，N不生成，Y生成
            trmIsCre: {
                value: 'N'
            },
            // 0开通 1默认不开通
            mercD1IsOpen: {
                value: '1',
            },
            // A1一对一，A2多对多
            mercBusRela: {
                value: 'A1'
            },
            // POS前置商户号，PAY 支付商户号 默认:PAY
            isPrintZFMercNm: {
                value: 'PAY'
            },
            // 支持类型
            mercBusType: {
                value: '1'
            },
            // 商户业务代码
            payments: {
                value: 'cardpay'
            },
            // 验证身份
            isRealAuth: {
                value: 'N'
            },
            productType: {
                value: 'jfbpos',
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
            checkCode: {
                value: '',
                label: '验证码',
                type: 'tel',
                placeholder: '请输入验证码',
                max_length: 6,
                use_filter: false,
                visible: true,
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入验证码',
                    },
                ],
            },
            certificNm: {
                is_margin: true,
                value: '',
                label: '法人代表姓名',
                placeholder: '请输入法人姓名',
                max_length: 15,
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
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入商户简称',
                    },
                ],
            },
            // mercEnglishNm: {
            //     value: '',
            //     label: '商户英文名',
            //     placeholder: '请输入商户英文名',
            //     max_length: 30,
            //     use_check: [
            //         {
            //             nonempty: true,
            //             prompt: '请输入商户英文名',
            //         },
            //     ],
            // },
            mercTypeMCCName: {
                value: '',
                label: 'MCC码',
                placeholder: '请选择MCC码',
                use_arrow: true,
                use_input: false,
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
            crpEffStartDt: {
                value: '',
                label: '身份证开始有效期',
                placeholder: '请选择身份证开始有效期',
                use_arrow: true,
                use_input: false,
                is_error: false,
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
                is_error: false,
                prompt: '身份证结束有效期必须大于开始有效期',
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
                label: '商户营业执照号(AB类必填)',
                placeholder: '请输入营业执照号',
                max_length: 25,
                use_check: [
                    // {
                    //     nonempty: true,
                    //     prompt: '请输入商户营业执照号',
                    // },
                    {
                        rule: /^[a-zA-Z0-9]{1,25}$/,
                        prompt: '商户营业执照号输入错误',
                    }
                ],
            },
            busRegStartDt: {
                value: '',
                label: '营业执照开始日期(AB类必填)',
                placeholder: '请输入营业执照开始日期',
                max_length: 25,
                use_arrow: true,
                use_input: false,
                use_check: [
                    // {
                    //     nonempty: true,
                    //     prompt: '请输入营业执照开始日期',
                    // }
                ],
            },
            busRegEndDt: {
                value: '',
                label: '营业执照结束日期(AB类必填)',
                placeholder: '请输入营业执照结束日期',
                max_length: 25,
                use_arrow: true,
                use_input: false,
                use_check: [
                    {
                        // nonempty: true,
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
};

export default {
    data,
    // methods,
}
