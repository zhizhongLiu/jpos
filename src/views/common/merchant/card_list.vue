<template>
    <dd-page title="选择开户行">
        <div class="search-wrap">
            <input v-model="key_words"
                placeholder="请输入银行名称"
                type="text"
                class="search-input" />
        </div>
        <div class="br"></div>
        <!-- 银行列表 -->
        <list class="list">
            <cell class="cell"
                v-for="(bank, i) in bankComputed"
                :key="i">
                <div class="panel"
                    @click="selectedBank(bank)">
                    <!--<image :src='bankIcon(bank.bankCd) || icon_default' class="bank-icon"></image> -->
                    <text class="text">{{ bank.bank_name }}</text>
                </div>
            </cell>
        </list>
    </dd-page>

</template>
<script>
    import source from 'helpers/source';
    import toast from 'helpers/toast';
    import router from 'plugins/router';
    import channel from 'plugins/channel';
    import auth from 'helpers/auth';
    import Api from 'api/entry.api'

    const $$SELECT_BANK = '$$SELECT_BANK';

    export default {
        components: {
            ddPage: require('dd-components/vue/dd-page.vue'),
        },
        data() {
            return {
                bank_list: [],
                key_words: '',
            }
        },
        computed: {
            icon_default() {
                return source('bank_000.png');
            },
            search_img() {
                return source('fd_9.png');
            },
            bankComputed() {
                if (!this.key_words) return this.bank_list;
                var arr = [];
                this.bank_list.forEach((item) => {
                    if (item.bank_name.indexOf(this.key_words) > -1) arr.push(item);
                });
                return arr;
            }
        },
        methods: {
            bankIcon(id) {
                return source('bank_' + id + '.png');
            },
            selectedBank(e) {
                //取值并发送到上一个页面
                channel.post($$SELECT_BANK, e);
                router.pop();
            },
            getBankList() {
                auth.getToken().then(info => {
                    Api.getBankList().then((card) => {
                        this.bank_list = card;
                    }).catch((error) => {
                        toast(error);
                    });
                })
            }
        },
        created() {
            this.getBankList();
        }
    };
</script>
<style>
    .list {
        flex: 1;
        width: 750px;
        background-color: #fff;
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

    .br {
        height: 20px;
        width: 750px;
        background-color: #f2f2f2;
    }

    .search-wrap {
        height: 100px;
        border-width: 1px;
        border-color: #f5f5f9;
        background-color: #ffffff;
        flex-direction: row;
        align-items: center;
        padding-left: 30px;
        padding-right: 30px;
    }

    .search-input {
        flex: 1;
        height: 60px;
        border-width: 1px;
        border-color: #999;
        border-style: solid;
        border-radius: 60px;
        padding-left: 30px;
        padding-right: 30px;
    }
</style>
