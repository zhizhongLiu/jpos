<template>
    <dd-page title="选择开户行">
        <div class="search-wrap">
            <input v-model="key_words" @input="inputHandle" placeholder="请输入银行名称或银行联行号" type="text" class="search-input"/>
            <!-- <wow-button
                button_margin_top="0"
                button_width="130"
                button_height="60"
                @click="handleSure"
                button_txt="确定">
            </wow-button> -->
        </div>
        <div class="br"></div>
        <!-- 银行列表 -->
        <list class="list">
            <cell class="cell" v-for="(bank, i) in bankComputed" :key="i">
                <div class="panel" @click="selectedBank(bank)">
                    <text class="text">{{ bank.bankName }}</text>
                </div>
            </cell>
        </list>
    </dd-page>
</template>
<script>
    import toast                    from 'helpers/toast';
    import router                   from 'plugins/router';
    import channel                  from 'plugins/channel';
    import auth                     from 'helpers/auth';
    import Api                      from 'api/entry.api'
    import WowButton                from 'wow-weex/lib/wow-button'
    const $$SELECT_BRANCH = '$$SELECT_BRANCH';
    export default {
        components: {
            ddPage: require('dd-components/vue/dd-page.vue'),
            WowButton
        },
        data() {
            return {
                bank_list: [],
                info: {},
                key_words: '',
                bankComputed:[]
            }
        },
        // computed: {
        //     bankComputed () {
        //         var reg = new RegExp("^[0-9]*$");
        //         if (!this.key_words || reg.test(this.key_words)) return this.bank_list;
        //         var arr=[];
        //         this.bank_list.forEach((item) => {
        //             if(item.bankName.indexOf(this.key_words) > -1) arr.push(item);
        //         });
        //         return arr;
        //     }
        // },
        created () {
            this.params = router.getParams(this) || {};
            this.getBankList();
        },
        methods: {
            selectedBank(e) {
                //取值并发送到上一个页面
                // toast(e)
                channel.post($$SELECT_BRANCH, e);
                router.pop();
            },
            inputHandle() {
                if(!this.key_words) return this.bankComputed=this.bank_list;
                this.bankComputed=[];
                this.bank_list.forEach((item) => {
                    if(item.bankName.indexOf(this.key_words) > -1 ||item.bankNo.indexOf(this.key_words) > -1) this.bankComputed.push(item);
                });
            },
            // handleSure(callback) {
            //     callback();
            //     if(!Reg.isNumber(this.key_words)){
            //         return toast('联行号输入有误')
            //     }
            //     channel.post($$SELECT_BRANCH, {bankName:this.key_words,bankNo:this.key_words});
            //     router.pop();
            // },
            getBankList() {
                auth.getToken().then(info => {
                    let options = {
                        method: 'POST',
                        body: {
                            token: info.token,
                            cityCode: this.params.city_cd,
                            shortBankNo: this.params.bank_cd,
                            keywords: '',
                        },
                        loading: true
                    };
                    Api.fetchBranchBankList(options).then(result => {
                        let { code, msg, data } = result;
                        if (code !== '0000') throw msg;
                        data = data ? JSON.parse(data) : {};
                        this.bank_list = data || [];
                        this.bankComputed=this.bank_list;
                    }).catch(error => toast(error));
                })
            }
        },
    };
</script>
<style>
    .list {
        width: 750px;
        background-color: #ffffff;
    }

    .cell {
        height: 100px;
    }

    .panel {
        height: 100px;
        flex-direction: row;
        border-width: 1px;
        border-color: #f5f5f9;
        background-color: #ffffff;
        align-items: center;
    }

    .panel:active {
        background-color: lightgray;
    }

    .bank-icon {
        width: 80px;
        height: 80px;
        margin-left: 30px;
    }

    .text {
        font-size: 32px;
        color: #4A4A4A;
        margin-left: 32px;
    }
    .br{
        height: 20px;
        width: 750px;
        background-color: #f2f2f2;
    }
    .search-wrap{
        height: 100px;
        border-width: 1px;
        border-color: #f5f5f9;
        background-color: #ffffff;
        flex-direction: row;
        align-items: center;
        padding-left: 30px;
        padding-right: 30px;
    }
    .search-input{
        flex: 1;
        /* width: 550px; */
        height: 60px;
        border-width: 1px;
        border-color: #999;
        border-style: solid;
        border-radius: 60px;
        padding-left: 30px;
        padding-right: 30px;
        margin-right: 20px;
    }
</style>
