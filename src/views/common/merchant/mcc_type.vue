<template>
    <dd-page title="子类别">
        <list class="list">
            <cell class="cell" v-for="(item , key) in arr_list" :key="key">
                <div class="cell-panel" @click="click(item.name)">
                    <text class="text">{{item.name}}</text>
                    <image class="img" :src="right_image"></image>
                </div>
            </cell>
        </list>
    </dd-page>
</template>
<script>
    import Source                       from 'helpers/source'
    import Router                       from 'plugins/router'
    import Toast                        from 'helpers/toast'
    import Api                          from 'api/entry.api'
    import Loading                      from 'plugins/loading'

    export default {
        components: {
            ddPage: require('dd-components/vue/dd-page.vue')
        },
        computed: {
            right_image() {
                return Source('tkzh_3.png');
            }
        },
        created() {
            this.name = Router.getParams(this).name || '';
            this.getTypeDetail();
        },
        data () {
            return {
                arr_list: [],
                name: '',
            }
        },
        methods: {
            click(name){
                Router.push({ url: 'common_merchant_mcc_detail', animated: 'true', close: 'true' }, {
                    name: this.name,
                    sub_name: name,
                });
            },
            getTypeDetail () {
                Loading.show();
                Api.fetchMccList().then((result) => {
                    let arr = result.data || [];
                    arr.forEach((item) => {
                        if (item.name === this.name) {
                            return this.arr_list = item.value || [];
                        }
                    })
                }).catch((error) => {
                    Toast(error);
                }).finally(() => {
                    Loading.hide();
                });
            },
        }
    }
</script>
<style>
    .list {
        width: 750px;
        margin-top: 20px;

    }
    .cell {
        width: 750px;
        height: 88px;
        background-color:#ffffff;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #DDDDDD;
    }
    .cell-panel {
        width: 750px;
        height: 88px;
        flex: 1;
        justify-content: center;
        align-items:flex-start;
    }
    .cell-panel:active {
        background-color: #e5e5e5;
    }
    .text {
        margin-left: 30px;
        text-align: left;
        font-size:28px;
        color:#333333;
    }
    .img {
        position: absolute;
        width: 26px;
        height: 26px;
        top: 30px;
        right: 10px;
    }
</style>
