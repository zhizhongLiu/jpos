<template>
    <wow-view view_header_center_txt="商户进件" :view_use_scroll="false">
        <wow-carousel
                carousel_height="320"
                :carousel_arr="arr_carousel">
        </wow-carousel>
        <wow-button
                button_txt="添加"
                @click="handleAdd"
                class="button"
                button_margin_top="20">
        </wow-button>
        <wow-nav-bar nav_height="90"
                :nav_use_menu="false"
                nav_position="top"
                nav_background_color="#FFF"
                nav_checked_color="#EE4432"
                :nav_arr="arr_nav">
            <div class="menu-wrap"
                 slot="menu">
                <div class="menu-item"
                     v-for="(item, index) in arr_nav"
                     :key="index"
                     @click="handleSwitch(index)">
                    <text class="menu-item-txt"
                          :style="{color: item.checked ? '#F76B1C' : '#373737'}">{{item.txt}}</text>
                    <div v-if="item.checked"
                         class="menu-line"></div>
                </div>
            </div>
        </wow-nav-bar>
    </wow-view>
</template>
<script>
    import WowView              from 'wow-weex/lib/wow-view'
    import WowCarousel          from 'wow-weex/lib/wow-carousel'
    import WowButton            from 'wow-weex/lib/wow-button'
    import WowNavBar            from 'wow-weex/lib/wow-navbar'
    import source               from 'utils/source.util'
    import router               from 'plugins/router';
    export default {
        data () {
            return {
                arr_carousel: [
                    { image: source('banner_2.png') },
                ],
                arr_nav: [
                    {
                        txt: '已提交',
                        src: 'common_merchant_submit_after',
                        checked: true
                    }, {
                        txt: '待提交',
                        src: 'common_merchant_submit_before',
                        checked: false
                    },
                ]
            }
        },
        methods: {
            handleAdd (callback) {
                callback();
                router.push('common_merchant_base_info')
            },

            handleSwitch (index) {
                this.arr_nav.forEach((item, i) => {
                    item.checked = i === index;
                });
            }
        },
        components: {
            WowView,
            WowCarousel,
            WowButton,
            WowNavBar,
        }
    }
</script>
<style>
    .button{
        margin-left: 30px;
        margin-bottom: 20px;
    }
    .menu-wrap {
        height: 90px;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        flex-direction: row;
        background-color: #fff;
        border-color: #eaedf2;
        border-bottom-width: 1px;
        border-top-width: 1px;
    }

    .menu-item {
        flex: 1;
        align-items: center;
    }

    .menu-item-txt {
        font-size: 36px;
        color: #000;
        margin-top: 26px;
    }

    .menu-line {
        width: 130px;
        height: 6px;
        margin-top: 12px;
        background-color: #F76B1C;
    }
</style>
