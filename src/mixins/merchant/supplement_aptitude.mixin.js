const data = () => {
    return {
        obj_hidden: {
            mercMbl: {
                value: ''
            },// 商户业务代码
            payments: {
                value: ''
            },
        },
        obj_image: {
            // 营业执照
            busiLicenseImg: {
                value: '',
                label: '营业执照',
                src: '',
                use_check: [
                    {
                        nonempty: false,
                        prompt: '请选择营业执照',
                    }
                ]
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
                use_check: [
                    {
                        nonempty: false,
                        prompt: '请选择门头照',
                    }
                ]
            },
            // 其它
            otherImg1: {
                value: '',
                label: '其它',
                src: '',
            },
        },
    }
};

export default {
    data,
    // methods,
}
