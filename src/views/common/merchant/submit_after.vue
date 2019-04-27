<template>
    <!-- <div class="wrap"> -->
    <wow-view @viewappear="handleViewAppear" :view_use_header="false" :view_use_scroll="false" view_background_color="#fff">
        <wow-scroll
            @refresh="handleRefresh"
            @loading="handleLoading"
            :scroll_use_loading="arr_merchant.length > 8">
            <merchant-cell
                v-for="(item, key) in arr_merchant"
                :merchant_item="item"
                :key="key">
            </merchant-cell>
            <cell class="cell-null" v-if="arr_merchant.length === 0">
                <text class="cell-null-text">暂无数据</text>
            </cell>
        </wow-scroll>
    </wow-view>
    <!-- </div> -->
</template>
<script>
    import WowScroll                from 'wow-weex/lib/wow-scroll'
    import WowView                  from 'wow-weex/lib/wow-view'
    import auth                     from 'helpers/auth'
    import Api                      from 'api/entry.api'
    import toast                    from 'helpers/toast'
    // import Channel                  from 'plugins/channel'
    import MerchantCell             from 'components/merchant/merchant-cell'

    // const $$RefreshList = "$$RefreshList";

    export default {
        data () {
            return {
                arr_merchant: [],
                num_page_size: 10,
                num_page_index: 1,
                loading_more: false
            }
        },
        created () {
            // this.fetchList('', true);
            // this.monitorEvent();
        },
        methods: {
            // 监听事件
            // monitorEvent() {
            //     Channel.add($$RefreshList, this.channelRefresh.bind(this));
            // },
            handleViewAppear() {
                // toast('我刷新了');
                this.fetchList('', true);
            },
            // channelRefresh() {
            //     toast('我刷新了');
            //     this.fetchList('', true);
            // },
            handleRefresh (callback) {
                this.num_page_index = 1;
                this.fetchList(callback);
            },
            handleLoading (callback) {
                this.num_page_index++;
                if (this.loading_more) return callback();
                this.fetchList(callback);
            },
            fetchList (callback, loading = false) {
                auth.getToken().then(info => {
                    let options = {
                        method: 'POST',
                        body: {
                            token: info.token,
                            agtMercId: ( info.cpos && info.cpos.agentId  ) || (info.jfbpos && info.jfbpos.agentId) || '',   // 代理商ID可传可不传
                            expandId: ( info.cpos && info.cpos.customerId  ) || (info.jfbpos && info.jfbpos.customerId) || '', // 业务员ID
                            pageNum: this.num_page_index,       // 1
                            numPerPage: this.num_page_size,     // 10
                        },
                        loading,
                    };
                    return Api.fetchMerchantList(options).then(result => {
                        let { code, msg, data } = result;
                        if (code !== '0000') throw msg;
                        data = data ? JSON.parse(data) : data;
                        console.log(data);
                        console.log('data.list', data.list);
                        if (this.num_page_index === 1) {
                            this.arr_merchant = data.list || [];
                        } else {
                            this.arr_merchant = [...this.arr_merchant, ...data.list];
                        }
                        this.loading_more = data.isLastPage; // 显示加载逻辑
                    }).catch(error => {
                        return toast(error);
                    }).finally(() => {
                        callback && callback();
                    });
                });
            },
        },
        components: {
            WowScroll,
            WowView,
            MerchantCell,
        }
    }
</script>
<style>
    .wrap{
        flex: 1;
    }
    .cell-null{
        flex: 1;
        justify-content: center;
        align-items: center;
    }
    .cell-null-text{
        color: #999;
        font-size: 32px;
    }
</style>
