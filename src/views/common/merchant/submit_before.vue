<template>
    <div class="wrap" @viewappear="handleViewAppear">
        <wow-scroll
                @refresh="handleRefresh"
                @loading="handleLoading"
            :scroll_use_loading="arr_merchant.length > 8">
            <template v-if="arr_merchant">
                <merchant-un-cell
                        @click="handleJump"
                        v-for="(item, key) in arr_merchant"
                        :merchant_item="item"
                        :key="key">
                </merchant-un-cell>
            </template>
            <cell class="cell-null" v-if="arr_merchant.length === 0">
                <text class="cell-null-text">暂无数据</text>
            </cell>
        </wow-scroll>
    </div>
</template>
<script>
    import WowScroll                from 'wow-weex/lib/wow-scroll'
    import toast                    from 'helpers/toast'
    import MerchantUnCell           from 'components/merchant/merchant-un-cell'
    import EntryUtil                from 'utils/entry.util'
    import Router                   from 'plugins/router'
    import loading                  from 'plugins/loading'
    export default {
        data () {
            return {
                arr_merchant: [],
            }
        },
        created () {
            this.fetchList();
        },
        methods: {
            // 加载数据
            handleViewAppear () {
//                this.fetchList();
            },

            // 刷新
            handleRefresh (callback) {
                this.fetchList(callback);
            },

            // 加载
            handleLoading (callback) {
                this.fetchList(callback);
            },

            // 获取列表
            fetchList (callback) {
                !callback && loading.show();
                EntryUtil.get().then((result) => {
                    // console.log('获取到了列表', result);
                    this.arr_merchant = result;
                }).catch(() => {
                    toast('获取存储失败')
                }).finally(() => {
                    callback && callback();
                    loading.hide();
                })
            },

            // 列表点击事件
            handleJump ({key}) {
                Router.push('common_merchant_base_info', {key})
            },
        },
        components: {
            WowScroll,
            MerchantUnCell,
        }
    }
</script>
<style>
    .wrap{
        flex: 1;
        background-color: #fff;
    }
    .cell-null{
        flex: 1;
        background-color: #fff;
        justify-content: center;
        align-items: center;
    }
    .cell-null-text{
        color: #999;
        font-size: 32px;
    }
</style>
