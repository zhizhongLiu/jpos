<template>
    <wow-view
            :view_use_scroll="false"
            view_header_right_color="#F76B1C"
            view_header_center_txt="基本信息">
        <div class="merchant-wrap">
            <div class="merchant-tab-wrap button-bottom">
                <div class="tab1-item"
                     @click="handleTab('0', arr_examine, index)"
                     v-for="(item, index) in arr_examine"
                     :key="index">
                    <div class="fdr">
                        <image class="tab1-image" v-if="index === 0" :src="src_tab_1"></image>
                        <image class="tab1-image" v-if="index !== 0" :src="src_tab_2"></image>
                        <image class="tab1-image" v-if="index !== 0" :src="src_tab_3"></image>
                    </div>
                    <text class="tab1-text">{{item.tab_text}}</text>
                    <div class="tab1-line" v-if="item.active"></div>
                </div>
            </div>
            <div class="merchant-content button-bottom" >
                <div class="examine-info-con" :style="{visibility: item.active ? 'visible' : 'hidden'}" v-for="(item, index) in arr_examine" :key="index">
                    <div class="flex1" v-if="item.template === 'card-status'">
                        <div class="examine-info-con-status">
                            <text class="examine-info-con-label">商户审核：</text>
                            <text class="examine-info-con-text"
                                :style="{ color: statusColor(obj_params.updateStatus) }">{{ cardStatus(obj_params) }}</text>
                        </div>
                        <div class="examine-info-con-status"  v-if="obj_params.updateStatus == 2">
                            <text class="examine-info-con-label">商户等级：</text>
                            <text class="examine-info-con-text" :style="{ color: levlColor(obj_params.updateStatus) }">{{cardLevl(data.mercLevl)}}</text>
                        </div>
                        <div class="examine-info-con-status">
                            <text class="examine-info-con-label">商户号：</text>
                            <text class="examine-info-con-text" :style="{ color: statusColor(obj_params.updateStatus) }">{{obj_params.customerId}}</text>
                        </div>
                        <!--<div class="examine-info-con-status">-->
                            <!--<text class="examine-info-con-label">DO</text>-->
                            <!--<div class="switch-box">-->
                                <!--<div class="switch-inner"></div>-->
                            <!--</div>-->
                            <!--<text class="examine-info-con-label-te">T1</text>-->
                        <!--</div>-->
                    </div>
                    <div class="flex1"
                        v-if="item.template === 'nocard-status'">
                        <div class="examine-info-con-status">
                            <text class="examine-info-con-label">微&nbsp;&nbsp;&nbsp;&nbsp;信：</text>
                            <text class="examine-info-con-text"
                                :style="{color: statusColor(obj_params.wxPay)}">{{ noCardStatus(obj_params.wxPay) }}</text>
                        </div>
                        <div class="examine-info-con-status">
                            <text class="examine-info-con-label">支付宝：</text>
                            <text class="examine-info-con-text"
                                :style="{color: statusColor(obj_params.aliPay)}">{{ noCardStatus(obj_params.aliPay) }}</text>
                        </div>
                    </div>
                    <div class="examine-info-con-item-te" v-if="item.template === 'card-status' && obj_params.updateStatus === '3'">
                        <div class="examine-btn bgc-orange" @click="handlePrompt">
                            <text class="examine-button-txt color-blue">查看原因</text>
                        </div>
                        <div class="examine-btn bgc-blue" @click="handleJump('common_merchant_base_info')">
                            <text class="examine-button-txt color-white">重新提交</text>
                        </div>
                    </div>
                    <div class="examine-info-con-item-te" v-if="item.template === 'card-status' && obj_params.updateStatus === '2'">
                        <div class="examine-btn bgc-white">
                            <text class="color-white">全部修改</text>
                        </div>
                        <div class="examine-btn bgc-blue" @click="handleJump('common_merchant_base_info', 'all')">
                            <text class="examine-button-txt color-white">全部修改</text>
                        </div>
                    </div>
                    <!-- <div class="open-nocard-wrap"
                        v-if="item.template === 'nocard-status' && (!obj_params.wxPay && !obj_params.aliPay)">
                        <div class="open-nocard"
                            @click="handleJump('common_merchant_supplement_nocard')">
                            <text class="open-nocard-txt">补充开通无卡</text>
                        </div>
                    </div> -->
                </div>
            </div>
        </div>

        <div class="container-info">
            <scroller class="container-tab" scroll-direction="horizontal">
                <div class="container-tab-item"
                     @click="handleTab('1',arr_container, index)"
                     :class="[item.active && 'container-tab-item-active']"
                     v-for="(item, index) in arr_container"
                     :key="index">
                    <text class="container-tab-item-text" :class="[item.active && 'color-white']">{{item.tab_text}}</text>
                </div>
            </scroller>
            <div class="flex1 mt20">
                <div class="container-info-con"
                    :style="{visibility: item.active ? 'visible' : 'hidden'}"
                    v-for="(item, index) in arr_container"
                    :key="index">
                    <rate-info
                        v-if="item.template === 'rate-info'"
                        class="flex1"
                        :data="data"
                        :obj_params="obj_params"
                        ref="rate_info">
                    </rate-info>
                    <account-info
                        v-if="item.template === 'account-info'"
                        class="flex1"
                        :data="data"
                        :obj_params="obj_params"
                        ref="account_info">
                    </account-info>
                    <install-manage
                        v-if="item.template === 'install-manage'"
                        class="flex1"
                        :data="data"
                        :obj_params="obj_params"
                        ref="install_manage">
                    </install-manage>
                    <base-info
                        v-if="item.template === 'base-info'"
                        class="flex1"
                        :data="data"
                        :obj_params="obj_params"
                        ref="base_info">
                    </base-info>
                    <credit-card
                        v-if="item.template === 'credit-card'"
                        class="flex1"
                        :data="data"
                        :obj_params="obj_params"
                        ref="credit_card">
                    </credit-card>
                </div>
            </div>
        </div>
    </wow-view>
</template>
<script>
    import WowView                  from 'wow-weex/lib/wow-view'
    import BaseInfo                 from './base-info.vue'
    import BusinessUpgrade          from './business-upgrade.vue'
    import InstallManage            from './install-manage.vue'
    import RateInfo                 from './rate-info.vue'
    import AccountInfo              from './account-info.vue'
    import CreditCard               from './credit-card.vue'
    import Source                   from 'utils/source.util'
    import Store                    from 'utils/store'
    import Router                   from 'plugins/router'
    import Channel                  from 'plugins/channel'
    import Api                      from 'api/entry.api'
    import Auth                     from 'helpers/auth'
    import Toast                    from 'helpers/toast'

    const $$RefreshDetail = '$$RefreshDetail';

    export default {
        data () {
            return {
                obj_params: '',
                src_tab_1: Source('dtb_details_tab_image1.png'),
                src_tab_2: '',
                src_tab_3: '',
                arr_examine: [
                    {
                        tab_text: '商户审核',
                        active: true,
                        template: 'card-status',
                    },
                    {
                        tab_text: '',
                        active: false,
                        template: 'nocard-status',
                    },
                ],
                arr_container: [
                    {
                        tab_text: '商户资料',
                        active: true,
                        template: 'base-info',
                    },
                    {
                        tab_text: '修改费率',
                        active: false,
                        template: 'rate-info',
                    },
                    {
                        tab_text: '结算账户资料',
                        active: false,
                        template: 'account-info',
                    },
                    {
                        tab_text: '装机管理',
                        active: false,
                        template: 'install-manage',
                    },
                    // {
                    //     tab_text: '商户升级',
                    //     active: false,
                    //     template: 'business-upgrade',
                    // },
                    {
                        tab_text: '信用卡验证',
                        active: false,
                        template: 'credit-card',
                    },
                ],
                data: '',
            }
        },
        created () {
            // 获取url参数
            this.fetchPageParams();
            // 获取详情
            this.fetchMerchantInfo();
            // 监听事件
            this.monitorEvent();
        },
        methods: {
            // 监听事件
            monitorEvent() {
                Channel.add($$RefreshDetail, this.channelRefreshHandle.bind(this));
            },
            handlePrompt() {
                this.data && Toast(this.data.merViewRemark)
            },
            handleJump(page, type) {
                if (page === 'common_merchant_base_info') {
                    Store.set('merc_details', {...this.data, mercCode: this.obj_params.customerId, uptType: '4', productType: 'jfbpos'}).then(() => {
                        if (type) return this.data && Router.push(page, { mbl: 'this.data.mercMbl', type: 'all' });
                        this.data && Router.push(page, { mbl: 'this.data.mercMbl' });
                    }).catch(() => {
                        // console.log('储存失败');
                    })
                } else {
                    Router.push(page, { mbl: 'this.data.mercMbl' });
                }
            },
            cardStatus(status) {      // 有卡审核状态文字描述
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
            noCardStatus(status) {      // 无卡审核状态文字描述
                var statusStr = ''
                switch (status) {
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
                    default:
                        statusStr = '未开通';
                        break;
                }
                return statusStr;
            },
            statusColor(status) {      //审核状态文字颜色
                var color = '';
                // if (updateStatus > 0) {
                //     color = '#949494';
                //     return color;
                // }
                switch (status) {
                    case '2':
                        color = '#75C806';
                        break;
                    case '3':
                        color = '#BC2736';
                        break;
                    case '1':
                        color = '#949494';
                        break;
                    default:
                        color = '#949494';
                        break;
                }
                return color;
            },
            levlColor(status) {      // 商户等级状态颜色
                var color = ''
                if (status) {
                    color = '#75C806';
                } else {
                    color = '#BC2736';
                }
                return color;
            },
            cardLevl(status) {      // 商户等级文字
                var levl = ''
                switch (status) {
                    case '1':
                        levl = 'A';
                        break;
                    case '2':
                        levl = 'B';
                        break;
                    case '3':
                        levl = 'C';
                        break;
                    case '4':
                        levl = 'D';
                        break;
                    case '5':
                        levl = 'E';
                        break;
                    default:
                        levl = '无';
                        break;
                }
                return levl;
            },
            // 获取url参数
            fetchPageParams () {
                this.obj_params = Router.getParams(this) || {};
                // console.log(this.obj_params);

            },

            // 获取详情
            fetchMerchantInfo () {
                Auth.getToken().then((info) => {
                    let options = {
                        method: 'POST',
                        body: {
                            token: info.token,
                            customerId: this.obj_params.customerId,
                        },
                        loading: true
                    };
                    return Api.fetchMerchantInfo(options).then(result => {
                        let { code, msg, data } = result;
                        if (code !== '0000') throw msg;
                        data = data ? JSON.parse(data) : data;
                        // console.log('映射前的数据=>', data);
                        if (data.mercTypeMCCName.indexOf('+') > -1) {   // Mcc
                            data.mercTypeMCCName = data.mercTypeMCCName.replace(/\+/g, '');
                        }
                        if (data.mercCity && data.mercCity.indexOf('+') > -1) {     // Mcc代码
                            data.mercCity = data.mercCity.replace(/\+/g, '');
                        }
                        if (data.mercProv && data.mercProv.indexOf('+') > -1) {   // 归属地代码
                            data.mercProv = data.mercProv.replace(/\+/g, '');
                        }
                        if (data.mercCityName && data.mercCityName.indexOf('+') > -1) {   // 归属地代码
                            data.mercCityName = data.mercCityName.replace(/\+/g, '');
                        }
                        if (data.city_cd && data.city_cd.indexOf('+') > -1) {   // 开户地代码
                            data.city_cd = data.city_cd.replace(/\+/g, '');
                        }
                        if (data.openAccountAddress && data.openAccountAddress.indexOf('+') > -1) {    // 开户地
                            data.openAccountAddress = data.openAccountAddress.replace(/\+/g, ' ');
                        }
                        let dbMercMaxAmt = data.dbMercMaxAmt * 10000 / 1000000;
                        data.dbMercMaxAmt = dbMercMaxAmt;

                        data.mercArea = data.mercProvName + ' | ' + data.mercCityName;
                        data.certificNm = data.crpNm ? data.crpNm : data.certificNm;
                        data.certificNo = data.crpNo ? data.crpNo : data.certificNo;

                        console.log('data', data);
                        // data.settCrpNo = data.settCrpno ? data.settCrpno : '';

                        let feeData = data.feeData;
                        if (feeData) {
                            data.dbCardSettFee = feeData.debitCard.basisRate;   // 借记卡比例
                            data.dbMercMaxAmt = feeData.debitCard.highestAmount * 10000 / 1000000;    // 借记卡封顶
                            data.crdCardSettFee = feeData.creditCard.basisRate;    // 贷记卡比例
                            data.d0FeeDebit1 = feeData.debitCard_D0 && feeData.debitCard_D0.basisRate;    // 贷记卡比例
                            data.d0FeeCredit1 = feeData.creditCard_D0 && feeData.creditCard_D0.basisRate;    // 贷记卡比例

                        } else if(!data.d0FeeDebit1){
                            let debit = data.d0debitCardFee && data.d0debitCardFee.split('|');
                            let credit = data.d0debitCardFee && data.d0creditCardFee.split('|');
                            data.d0FeeDebit1 = debit[0];
                            data.d0FeeCredit1 = credit[0];
                        }
                        data.busRegStartDt = data.busRegStart;
                        data.busRegEndDt = data.busRegEnd;
                        this.data = data;

                        if (this.data) {
                            this.refsMethod('base_info', 'initData');
                            this.refsMethod('rate_info', 'initData');
                            this.refsMethod('account_info', 'initData');
                            this.refsMethod('install_manage', 'initData');
                            this.refsMethod('credit_card', 'initData');
                            // this.refsMethod('business_upgrade', 'initData');
                        }
                    }).catch(error => {
                        Toast(error)
                    });
                })
            },

            // refs method
            refsMethod (ref, method) {
                this.$refs && this.$refs[ref] && this.$refs[ref][method] && this.$refs[ref][method]();
                this.$refs && this.$refs[ref] && this.$refs[ref][0] && this.$refs[ref][0][method] && this.$refs[ref][0][method]();
            },

            // tab切换
            handleTab (type, arr, i) {
                if (type === '0') return;
                arr && arr.forEach((item, index) => {
                    item.active = i === index;
                })
            },
            // 选择MCC监听处理
            channelRefreshHandle() {
                // console.log('刷新详情页');
                this.fetchMerchantInfo();
            },

        },
        components: {
            WowView,
            BaseInfo,
            AccountInfo,
            BusinessUpgrade,
            InstallManage,
            RateInfo,
            CreditCard
        }
    }
</script>
<style>
    .button-bottom{
        border-color: #ddd;
        border-bottom-width: 1px;
    }
    .merchant-wrap{
        background-color: #fff;
    }
    .merchant-tab-wrap{
        height: 132px;
        flex-direction: row;
        align-items: center;
    }
    .tab1-item{
        flex: 1;
        align-items: center;
    }
    .tab1-image{
        margin-top: 14px;
        width: 52px;
        height: 52px;
    }
    .tab1-text{
        font-size: 28px;
        color: #373737;
        height: 40px;
        line-height: 40px;
        margin-top: 8px;
    }
    .tab1-line{
        width: 114px;
        height: 6px;
        margin-top: 14px;
        background-color: #F76B1C;
    }
    .merchant-content{
        height: 150px;
        /* background-color: aquamarine; */
    }
    .examine-info-con{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        /* flex: 1; */
        flex-direction: row;
        height: 150px;
        align-items: center;
    }
    .flex1 {
        flex: 1;
    }
    .fdr {
        flex-direction: row;
    }
    .examine-info-con-item-te{
        flex-direction: row;
        align-items: center;
        justify-content: center;

    }
    .examine-info-con-status{
        flex-direction: row;
        align-items: center;
    }
    .examine-info-con-label{
        font-size: 28px;
        color: #373737;
        padding-left: 30px;
    }
    .examine-info-con-label-te{
        font-size: 28px;
        color: #373737;
    }
    .examine-info-con-text{
        font-size: 28px;
        /* color: #373737; */
    }
    .examine-btn {
        padding-left: 20px;
        padding-right: 20px;
        height: 52px;
        border-color: #4D96EE;
        border-width: 1px;
        border-radius: 52px;
        justify-content: center;
        align-items: center;
        margin-right: 10px;
    }
    .examine-button-txt {
        font-size: 24px;
    }
    .color-white {
        color: #fff;
    }
    .color-blue {
        color: #4D96EE;
    }
    .bgc-white {
        background-color: #fff;
        border-color: #fff;
    }
    .bgc-orange {
        background-color: #F76B1C;
        border-color: #4D96EE;
    }
    .bgc-blue {
        background-color: #4D96EE;
        border-color: #4D96EE;
        margin-right: 32px;
    }
    .open-nocard-wrap {
        flex: 1;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
    }
    .open-nocard {

        /* width: 90px; */
        height: 52px;
        background-color: #4D96EE;
        border-color: #4D96EE;
        border-width: 1px;
        padding-left: 10px;
        padding-right: 10px;
        margin-right: 14px;
        border-radius: 52px;
        justify-content: center;
        align-items: center;
    }
    .open-nocard-txt {
        font-size: 24px;
        color: #fff;
    }
    .container-info{
        flex: 1;
    }
    .container-tab{
        height: 88px;
        width: 750px;
        flex-direction: row;
        align-items: center;
        padding-left: 18px;
        background-color: #fff;
    }
    .container-tab-item{
        padding-left: 25px;
        padding-right: 25px;
        height: 52px;
        border-radius: 52px;
        justify-content: center;
        align-items: center;
    }
    .container-tab-item-active{
        background-color: #F76B1C;
    }
    .container-tab-item-text{
        font-size: 24px;
        color: #373737;
    }
    .container-info-con{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom:0;
    }
    .switch-box{
        margin-left: 8px;
        margin-right: 8px;
        height: 40px;
        width: 70px;
        align-items: center;
        flex-direction: row;
        border-radius: 40px;
        border-color: #ddd;
        border-width: 1px;
        padding-left: 2px;
        padding-right: 2px;
        background-color: #50b9fe;
    }
    .switch-inner{
        width: 36px;
        height: 36px;
        border-radius: 36px;
        border-color: #ddd;
        background-color: #fff;
    }
    .mt20 {
        margin-top: 20px;
    }
</style>
