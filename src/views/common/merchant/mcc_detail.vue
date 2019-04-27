<template>
    <dd-page title="MCC">
        <list class="list">
            <cell class="cell" v-for="(item , key) in arr_list" :key="key">
                <div class="cell-panel" @click="click(item)">
                    <text class="text" >{{item.name}}</text>
                </div>
            </cell>
        </list>
    </dd-page>
</template>
<script>
    import Channel                      from 'plugins/channel'
    import Router                       from 'plugins/router'
    import Toast                        from 'helpers/toast'
    import Api                          from 'api/entry.api'
    import Loading                      from 'plugins/loading'

    const $$SELECT_MCC = '$$SELECT_MCC';

    export default {
        components: {
            ddPage: require('dd-components/vue/dd-page.vue')
        },
        data() {
            return {
                arr_list: [],
                sub_name: '',
                name: '',
            }
        },
        created () {
            this.name = Router.getParams(this).name || '';
            this.sub_name = Router.getParams(this).sub_name || '';
            this.getMCCDetail();
        },
        methods: {
            getMCCDetail () {
                Loading.show();
                Api.fetchMccList().then((result) => {
                    let arr = result.data || [];
                    let sub_arr = [];
                    arr.forEach((item) => {
                        if (item.name === this.name) {
                            return sub_arr = item.value || [];
                        }
                    });
                    sub_arr.forEach((item) => {
                        if (item.name === this.sub_name) {
                            return this.arr_list = item.value || [];
                        }
                    });
                }).catch((error) => {
                    Toast(error);
                }).finally(() => {
                    Loading.hide();
                });
            },
            click (item) {
                Channel.post($$SELECT_MCC, item);
                Router.pop();
            }
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
        flex: 1;
        justify-content: center;
        align-items:flex-start;
        width: 750px;
        height: 88px;
    }
    .cell-panel:active {
        background-color: #e5e5e5;
    }
    .text {
        margin-left: 30px;
        text-align: left;
        font-size:28px;
        color:#333333;
        lines:2;
        text-overflow: ellipsis;
    }
</style>
