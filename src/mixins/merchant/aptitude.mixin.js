const data = () => {
    return {
        obj_hidden: {
            mercMbl: {
                value: ''
            },
            receiptProImg: {
                value: ''
            }
        },
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
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请选择法人持证照',
                    }
                ]
            },
            // 收单协议照
            // receiptProImg: {
            //     value: '',
            //     label: '收单协议照',
            //     src: '',
            //     // type: 'sum',
            //     visible: false,
            //     use_check: [
            //         {
            //             nonempty: true,
            //             prompt: '请选择收单协议照',
            //         }
            //     ]
            // },
            receiptProImg1: {
                value: '',
                label: '收单协议照1',
                src: '',
                type: 'sum',
                disabled: false,
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
                disabled: false,
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
                disabled: false,
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请选择收单协议照3',
                    }
                ]
            },
            // receiptProImg4: {
            //     value: '',
            //     label: '收单协议照4',
            //     src: '',
            //     type: 'sum',
            //     use_check: [
            //         {
            //             nonempty: true,
            //             prompt: '请选择收单协议照4',
            //         }
            //     ]
            // },
        },
    }
};

export default {
    data,
    // methods,
}
