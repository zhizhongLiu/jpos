const data = () => {
    return {
        obj_hidden: {
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
            // D0交易开始时间
            transStartDate: {
                value: '060000',
            },
            // D0交易结束时间
            transEndDate: {
                value: '220000',
            },
            // 微信收费类型
            // wechatFeeTyp: {
            //     value: '0'
            // },
            // 支付宝收费类型
            // alipayFeeTyp: {
            //     value: '0'
            // },
            // 微信收费费率
            // wechatFee: {
            //     value: ''
            // },
            // // 支付宝收费比率
            // alipayFee: {
            //     value: ''
            // },
            // 基础|其他|最低|最高
            // D0借记卡手续费
            d0debitCardFee: {
                value: ''
            },
            // D0贷记卡手续费
            d0creditCardFee: {
                value: ''
            },
        },
        obj_input: {
            // 商户结算费率
            dbCardSettFee: {
                is_margin: true,
                value: '0.5',
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
            // 商户结算封顶费
            dbMercMaxAmt: {
                value: '20',
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
            // 商户结算费率
            crdCardSettFee: {
                value: '0.55',
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
            // // 无卡交易费率
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
            // 是否为D0业务
            settMark: {
                is_margin: true,
                value: 'D0',
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
                        prompt: '请选择是否为D0业务',
                    },
                ],
            },
            // D0结算费率(借记卡)
            d0FeeDebit1: {
                value: '0.5',
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
            //     use_check: [
            //         {
            //             nonempty: true,
            //             prompt: '请输入D0商户结算封顶费(借记卡)',
            //         },
            //     ],
            // },
            // D0结算费率(贷记卡)
            d0FeeCredit1: {
                value: '0.55',
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
            // // D0服务费
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
        },
    }
};

export default {
    data,
    // methods,
}
