<template>
    <div class="container">
        <list class="list" @scroll="onScroll">
            <cell>
                <slider class="slider" interval="3000" auto-play="true">
                    <div class="cm-border" v-for="(img, key) in banner_img_list" :key="key">
                        <image class="banner_img" resize="cover" :src="img.src" @click="bannerClicked(key)"></image>
                    </div>
                </slider>
            </cell>
            <cell>
                <text class="main-prompt">新手教程</text>
                <image class="bg-image" :src="bg_src"></image>
            </cell>
        </list>
        <div class="navi-bar" :style="{ backgroundColor: navbarBackColor, height: navbarHeight}">
            <text class="navi-title-txt" v-if="scrollDistance < 0">递推宝</text>
            <image class="nav-item-src" :src="msg_img_src" @click="messageClick"></image>
        </div>
    </div>

</template>
<script>
    import source from 'helpers/source';
    import source1 from 'helpers/source1';
    import router from 'plugins/router';
    import toast from 'helpers/toast';

    export default {

        data() {
            return {
                bg_src: source1('dtb-home-xsjc-bg.png'),
                banner_img_list: [
                    { 'src': source('home_Banner1.png') },
//                    { 'src': source('home_Banner2.jpg') },
                ],
                scrollDistance: 0,
                navbarBackColor: 'rgba(0, 0, 0, 0.0)',
                navbarHeight: '88px',
                meta_data: [],
                refresh_display: false,
                loading_display: false,

                data: [
                    {
                        title: '地推宝专区',
                        giide: '新手指引',
                        content: "第一次不开机后公开价格和科技感开个会公开接口个客户可以加京东卡哈伦裤建行卡...",
                        news_leftImg: source('ic_launcher.png'),
                        news_img: source('ic_launcher.png')


                    },
                    {
                        title: '点刷专区',
                        giide: '新手指引',
                        content: "第一次不开机后公开价格和科技感开个会公开接口个客户可以加京东卡哈伦裤建行卡...",
                        news_leftImg: source('ic_launcher.png'),
                        news_img: source('ic_launcher.png')

                    },
                    {
                        title: '点刷专区',
                        giide: '新手指引',
                        content: "第一次不开机后公开价格和科技感开个会公开接口个客户可以加京东卡哈伦裤建行卡...",
                        news_leftImg: source('ic_launcher.png'),
                        news_img: source('ic_launcher.png')

                    },
                    {
                        title: '点刷专区',
                        giide: '新手指引',
                        content: "第一次不开机后公开价格和科技感开个会公开接口个客户可以加京东卡哈伦裤建行卡...",
                        news_leftImg: source('ic_launcher.png'),
                        news_img: source('ic_launcher.png')

                    },
                    {
                        title: '点刷专区',
                        giide: '新手指引',
                        content: "第一次不开机后公开价格和科技感开个会公开接口个客户可以加京东卡哈伦裤建行卡...",
                        news_leftImg: source('ic_launcher.png'),
                        news_img: source('ic_launcher.png')

                    },
                    {
                        title: '点刷专区',
                        giide: '新手指引',
                        content: "第一次不开机后公开价格和科技感开个会公开接口个客户可以加京东卡哈伦裤建行卡...",
                        news_leftImg: source('ic_launcher.png'),
                        news_img: source('ic_launcher.png')

                    }
                ]
            }
        },
        methods: {
            bannerClicked() {

            },
            messageClick() {
                router.push('minemessage_center');
            },
            onScroll(e) {
                this.scrollDistance = e.contentOffset.y;
                var cap = -e.contentOffset.y;
                this.navbarBackColor = `rgba(255, 255, 255, 1.0)`;
                if (cap <= 10) {
                    this.navbarBackColor = 'rgba(255, 255, 255, 0.0)';
                }
            },

            onrefresh() {
                this.refresh().show();
            },
            onloading() {
                this.loading().show();

            },
            refresh() {
                return {
                    show: () => {
                        this.refresh_display = true;
                        setTimeout(() => this.refresh_display = false, 2000);
                    }
                }
            },
            loading() {
                return {
                    show: () => {
                        this.loading_display = true;
                        setTimeout(() => this.loading_display = false, 2000);
                    }
                }
            },
            infoClicked(e) {
                toast('1');
            },
        },
        created() {
            var env = this.$getConfig().env;
            if (env.platform === 'iOS') {
                this.navbarHeight = '128px'
            } else {
                this.navbarHeight = '88px';
            }

        },
        computed: {
            state() {
                return source('ic_launcher.png');
            },
            dot() {
                return source('ic_launcher.png');
            },
        }
    }

</script>
<style>
    .main-prompt{
        font-size: 32px;
        color: #333;
        padding-left: 36px;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .bg-image{
        width: 750px;
        height: 4824px;
    }
    .container {
        flex: 1;
    }
    .list {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 98px;
        background-color: #F6F6F6;
    }

    .slider {
        width: 750px;
        height: 430px;
    }

    .banner_img {
        align-items: center;
        width: 750px;
        height: 430px;
    }

    .navi-title-txt {
        position: absolute;
        bottom: 26px;
        left: 172px;
        right: 172px;
        text-align: center;
        color: #596d7a;
        font-size: 34px;
        font-weight: 400;
    }

    .nav-item-src {
        position: absolute;
        right: 30px;
        bottom: 25px;
        width: 45px;
        height: 45px;
    }

    .navi-bar {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        width: 750px;
        height: 88px;
        background-color: #ffffff;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
</style>
