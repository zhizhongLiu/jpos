<template>
    <cell class="cell">
        <div class="section" @click="handleClick(merchant_item)">
            <image class="headshot" :src="src_default"></image>
            <div class="content1">
                <div class="content-title">
                    <text class="title">{{merchant_item.mercCnm ? mercCnmComputed : merchant_item.mercAbbr}}</text>
                    <image class="wechatAuditStatus" v-if="merchant_item.wxPay" :src='pricwechatAuditStatus(merchant_item.wxPay)'></image>
                    <image class="alipayAuditStatus" v-if="merchant_item.aliPay" :src='pricalipayAuditStatus(merchant_item.aliPay)'></image>
                </div>
                <text class="time-txt">{{merchant_item.updateTime | filterTime}}</text>
            </div>
            <div class="type">
                <text class="txt-time" :style="{ color: pricingColor(merchant_item) }">{{ auditStatus(merchant_item) }}</text>
            </div>
        </div>
    </cell>
</template>
<script>
    import Source                   from 'utils/source.util'
    import Router                   from 'plugins/router'
    export default {
        props:{
            merchant_item: { default: {} },
            src_default: { default: Source('person.png') },
        },
        filters: {
            filterTime (value) {
                return value
                    ? `${value.substring(0,4)}-${value.substring(4,6)}-${value.substring(6,8)} ${value.substring(8,10)}:${value.substring(10,12)}` : '';
            },
        },
        computed: {
            mercCnmComputed() {
                return this.merchant_item.mercCnm.indexOf('+') > -1 ? this.merchant_item.mercCnm.replace(/\+/g, '') : this.merchant_item.mercCnm;
            }
        },
        methods: {
            handleClick (item) {
                Router.push('common_merchant_detail', item);
            },
            pricalipayAuditStatus(status) {   //根据状态 切换支付宝状态图片
                var statusStr = ''
                switch (status) {
                    case '3' :
                        statusStr = Source('pal-fail.png');
                        break;
                    case '1' :
                        statusStr = Source('pal-none.png');
                        break;
                    case '2' :
                        statusStr = Source('palFinish.png');
                        break;
                    default: break;
                }
                return statusStr;
            },
            pricwechatAuditStatus(status) {    //根据状态 切换微信状态图片
                var statusStr = ''
                switch (status) {
                    case '3' :
                        statusStr = Source('wechat-fial.png');
                        break;
                    case '1' :
                        statusStr = Source('wechat-none.png');
                        break;
                    case '2' :
                        statusStr = Source('wechatFinish.png');
                        break;
                    default: break;
                }
                return statusStr;
            },
            auditStatus(status) {      //审核状态文字描述
                var statusStr = '';
                // if (status.updateStatus > 0) {
                //     statusStr = '审核中';
                //     return statusStr;
                // }
                switch (status.updateStatus) {
                    case '2' :
                        statusStr = '审核成功';
                        break;
                    case '3' :
                        statusStr = '审核失败';
                        break;
                        break;
                    case '1' :
                        statusStr = '审核中';
                        break;
                    default: break;
                }
                return statusStr;
            },
            pricingColor(status) {         //审核状态 文字颜色
                var txtColor = '';
                // if (status.updateStatus > 0) {
                //     txtColor = '#596d7a';
                //     return txtColor;
                // }
                switch (status.updateStatus) {
                    case '2' :
                        txtColor = 'green';
                        break;
                    case '3' :
                        txtColor = 'red';
                        break;
                    case '1' :
                        txtColor = '#596d7a';
                        break;
                    default:
                        txtColor = '#596d7a';
                        break;
                }
                return txtColor;
            },
        }
    }
</script>
<style>
    .cell {
        height: 140px;
        width: 750px;
        background-color: #ffffff;
        border-bottom-width: 1px;
        border-bottom-color: #e5e5e5;
    }
    .section {
        height: 140px;
        width: 750px;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }

    .section-panel:active {
        background-color: #e5e5e5;
    }
    .headshot {
        margin-left: 30px;
        margin-top: 11px;
        width: 98px;
        height: 98px;
        border-radius: 49px;
    }
    .content1 {
        margin-left: 30px;
        flex-direction: column;
        width: 590px;
        height: 140px;
        /* background-color: aquamarine; */
    }
    .content-title{
        flex-direction: row;
        width: 400px;
        height:40px;
        margin-top: 40px;
    }
    .title {
        font-size:28px;
        color:#5a5d62;
        text-align: left;
    }
    .wechatAuditStatus{
        width: 30px;
        height: 30px;
        margin-left: 20px;
    }
    .alipayAuditStatus {
        width: 30px;
        height: 30px;
        margin-left: 20px;
    }
    .time-txt {
        font-size:22px;
        color:#888888;;
        text-align:left;
    }
    .type{
        position: absolute;
        top: 40px;
        right: 30px;
        width: 200px;
    }
    .txt-time {
        text-align: right;
        font-size: 30px;
        color: #596d7a;
        width: 200px;
    }
    .margin-l {
        margin-left: 10px;
    }
</style>
