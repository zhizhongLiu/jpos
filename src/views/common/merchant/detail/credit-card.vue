<template>
    <scroller>
        <div class="add-card" @click="handleAddCard">
            <image :src="add_src" class="add-img"></image>
            <text class="add-txt"> 添加未验证的信用卡</text>
        </div>
        <div class="card-wrap">
            <div class="cell-item-box" v-for="(item, index) in card_arr" :key="index">
                <div class="cell-item">
                    <image class="cell-img" :src="item.issInsCode | cardLogoFilter"></image>
                    <div>
                        <div class="name-cell">
                            <text class="cell-left-top-text">{{item.cardName}}</text>
                            <text :class="['status-txt', 'txt-' + item.sts]">{{statusTxt(item)}}</text>
                        </div>
                        <text class="cell-left-bottom-text">{{item.nameVli}}</text>
                        <text class="cell-left-bottom-text">{{item.bankNoHi}}</text>
                    </div>
                </div>
                <div class="cell-item">
                    <text class="arrow"></text>
                </div>
            </div>
        </div>
    </scroller>
</template>
<script>
    import WowInputCell             from 'wow-weex/lib/wow-input-cell'
    import EntryMixin               from 'mixins/merchant.mixin'
    import Source                   from 'utils/source.util'
    import Toast                    from 'helpers/toast'
    import Api                      from 'api/entry.api'
    import Channel                  from 'plugins/channel'
    import router                   from 'plugins/router';
    import Auth                     from 'helpers/auth'

    const $$CreditCard = '$$CreditCard';

    export default{
        mixins: [EntryMixin],
        data () {
            return {
                card_arr: '',
                add_src: Source('store-add-nor.png'),
                card_status: 'S'
            }
        },
        filters: {
            cardLogoFilter(value) {
                return value ? Source('bank_' + value + '.png') : '';
            },
        },
        props: {
            obj_params: { default: ''},
            data: { default: '' },
        },
        methods: {
            // 初始化数据
            initData () {
                this.fetchCard()
            },
            forEach(obj, callback) {
                for (let key in obj) {
                    callback && callback(obj[key], key);
                }
            },
            handleAddCard() {
                if (this.obj_params.updateStatus !== '2') return null;
                if (this.data.settMark === 'T1') return Toast('T1用户不能添加信用卡');
                if (!this.card_arr) return Toast('请求失败, 请稍后再试');;
                let haspass = false;
                this.card_arr && this.card_arr.forEach(function (item) {
                    item.sts === '01' ? haspass = true : null;
                });
                haspass ? Toast('只能验证一张信用卡') : router.push('common_merchant_credit_card_add',{
                    mercMbl: this.data.mercMbl,
                    certificNm: this.data.certificNm,
                    certificNo: this.data.certificNo,
                    customerId: this.obj_params.customerId,
                    // settAccMark: this.data.settAccMark,     // 账户类型 对公对私
                    // legalpersonIsSett: this.data.legalpersonIsSett,     // 是否非法人结算
                    haspass
                });
                
            },
            // 获取终端类型
            fetchCard(item) {
                Auth.getToken().then((info) => {
                    let options = {
                        method: 'POST',
                        body: {
                            token: info.token,
                            mercId: this.obj_params.customerId,
                        },
                        loading: true,
                        http: 'new',
                    };
                    Api.fetchCard(options).then((result) => {
                        console.log('result', result);
                        let { respCode, respDesc, data } = result;
                        if (respCode !== '0000') throw respDesc;
                        this.card_arr = data;

                    }).catch(error => {
                        console.log(error);
                        this.card_arr = '';
                        Toast(error)
                    });
                })
            },
            statusTxt(item) {
                let txt = '';
                if (item.sts === '01') {
                    txt = '验证成功';
                } else if(item.sts === '02') {
                    txt = '验证失败';
                } else if(item.sts === '04') {
                    txt = '验证失败';
                }
                return txt;
            },
        },
        components: {
            WowInputCell,
        },
        created() {
            Channel.add('$$CreditCard', () => {
                this.initData();
            });
        },
    }
</script>
<style>
    .add-card {
        width: 750px;
        height: 100px;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background-color: #fff;
    }
    .add-img {
        width: 40px;
        height: 40px;
    }
    .add-txt {
        font-size: 28px;
        margin-left: 16px;
        color: #646464;
    }
    .card-wrap {
        margin-top: 40px;
        background-color: #fff;
    }
    .cell-item-box {
        flex-direction: row;
        justify-content: space-between;
        border-bottom-width: 2px;
        border-color: #E5E5E5;
    }
    .cell-item {
        height: 160px;
        flex-direction: row;
        align-items: center;
    }
    .cell-img {
        width: 72px;
        height: 72px;
        margin-right: 10px;
        margin-left: 24px;
    }
    .name-cell {
        flex-direction: row;
        align-items: center;
    }
    .cell-left-top-text {
        font-size: 32px;
        color: #4A4A4A;
        line-height: 60px;
    }
    .cell-left-bottom-text {
        font-size: 26px;
        color: #979797;
        line-height: 36px;
    }
    .status-txt {
        font-size: 24px;
        padding-left: 14px;
        padding-right: 14px;
        padding-top: 4px;
        padding-bottom: 4px;
        border-radius: 20px;
        margin-left: 10px;
    }
    .txt-01 {
        background-color: #4AC295;
        color: #fff;
    }
    .txt-02 {
        color:#F04632;
        background-color: rgba(240,70,50,.1);
    }
    .txt-04 {
        color:#F04632;
        background-color: rgba(240,70,50,.1);
    }
    .arrow {
        height: 24px;
        width: 24px;
        border-width: 3px;
        border-style: solid;
        border-top-color: #CCCCCC;
        border-right-color: #CCCCCC;
        border-bottom-color: transparent;
        border-left-color: transparent;
        transform: rotate(45deg);
        margin-right: 20px;
    }
</style>
