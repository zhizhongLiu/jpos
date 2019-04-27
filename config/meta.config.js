import env    from './../src/config/env.config'

let url = env.PICTURE_URL;

export default [
    {
        "type": "page",
        "name": "dtb_common_home",
        "components": [
            {
                "type": "square",
                "data": [
                    {
                        "icon": "http://ptstatics.oss-cn-shanghai.aliyuncs.com/dtb/images/tnkt.png",
                        "title": "替你开通",
                        "action": [
                            {
                                "push": "openforu_open"
                            }
                        ]
                    },
                    {
                        "icon": "http://ptstatics.oss-cn-shanghai.aliyuncs.com/dtb/images/tndb.png",
                        "action": [
                            {
                                "push": "common_merchant_entry"
                            }
                        ],
                        "title": "商户进件"
                    },
                    {
                        "icon": "http://ptstatics.oss-cn-shanghai.aliyuncs.com/dtb/images/zydj_icon.png",
                        "title": "自由定价",
                        "action": [
                            {
                                "push": "price_pricelist"
                            }
                        ]
                    },
                    {
                        "icon": "http://ptstatics.oss-cn-shanghai.aliyuncs.com/dtb/images/InviteDoCard.png",
                        "title": "邀请办卡",
                        "action": [
                            {
                                "link": "https://finumi.com/html/QR-code.html?jf_phone=${PHONE}&appId=${APPID}"
                            }
                        ]
                    }
                ],
                "options": {
                    "each": 2,
                    "type": "larger"
                }
            }
        ]
    }
]
