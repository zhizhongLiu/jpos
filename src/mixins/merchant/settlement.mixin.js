const data = () => {
    return {
        obj_hidden: {
            mercMbl: {
                value: ''
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
            // weChat: {
            //     value: true,
            // },
            // 是否非法人结算
            legalpersonIsSett: {
                value: 'N',
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
            //             prompt: '请选择结算人身份证号照',
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
                        prompt: '请选择银行卡正面照',
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
                disabled: false,
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
                disabled: false,
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请填写账户名',
                    }
                ],
            },
            // 银行预留手机号
            bankMbl: {
                value: '',
                label: '结算账户预留手机号',
                placeholder: '请填写结算账户预留手机号',
                max_length: 20,
                visible: false,
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
                visible: false,
                disabled: false,
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
    }
};

export default {
    data,
    // methods,
}
