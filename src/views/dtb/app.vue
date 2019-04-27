<template>
    <div>
        <div class="container">
            <embed class="content" v-for="(item, key) in tabItems" :key="key" :style="{visibility: item.visibility}"
                   :src="item.src"
                   type="weex"></embed>
        </div>
        <div class="tabbar" :style="{ paddingBottom: is_iphoneX ? 68 : 0}">
            <div class="tabbar-item" v-for="(item, key) in tabItems" :key="key" @click="selected(item.index)">

                <div class="icon-box">
                    <image :src="item.checked ? item.img_src1 : item.img_src2" class="icon"></image>
                </div>

                <div class="txt-box">
                    <text :class="['txt-' + item.visibility]">{{item.txt}}</text>
                </div>

            </div>
        </div>

    </div>
</template>

<script>
    import toast from 'helpers/toast';
    import path from 'plugins/path';
    import source from 'helpers/source';
    import channel from 'plugins/channel';
    import router from 'plugins/router';

    export default {
        data() {
            return {
                is_iphoneX: false,//iPhoneX兼容
                tabItems: [
                    {
                        index: 0,
                        txt: '首页',
                        src: 'dtb_common_home',
                        visibility: 'visible',
                        img_src1: source('sy_selected.png'),
                        img_src2: source('sy_normal.png'),
                        checked: true
                    },
                    {
                        index: 1,
                        txt: '即富商学院',
                        src: 'dtb_user_jfhome',
                        visibility: 'hidden',
                        img_src1: source('sxy_selected.png'),
                        img_src2: source('sxy_normal.png'),
                        checked: false
                    },
                    {
                        index: 2,
                        txt: '我的',
                        src: 'dtb_mine',
                        visibility: 'hidden',
                        img_src1: source('wd_selected.png'),
                        img_src2: source('wd_normal.png'),
                        checked: false
                    }
                ]
            }
        },
        methods: {
            selected(index) {
                if (index === this.selectedIndex) {
                    return null;
                }
                ;
                this.selectedIndex = index;
                for (var i = 0; i < this.tabItems.length; i++) {
                    var tabItem = this.tabItems[i];
                    if (i == index) {
                        tabItem.visibility = 'visible';
                        tabItem.checked = true;
                    } else {
                        tabItem.visibility = 'hidden';
                        tabItem.checked = false;
                    }
                }
                ;
            },
        },
        created() {
            var env = this.$getConfig().env;
            if (env.platform === 'iOS') {
                this.is_iphoneX = ['iPhone10,3', 'iPhone10,6'].indexOf(this.$getConfig().env.deviceModel) > -1;
            }
            for (var i = 0; i < this.tabItems.length; i++) {
                (function (index, tabs) {
                    path.page(tabs[index].src).then(function (url) {
                        tabs[index].src = url;
                    }).catch(function (error) {
                        toast(error);
                    });
                })(i, this.tabItems)
            }
            ;
            channel.add('$$LOGINSUCCESS', e => {
                router.root();
            });
        }
    }
</script>

<style>
    .tabbar {
        flex-direction: row;
        align-items: center;
        background-color: white;
        border-top-color: #e5e5e5;
        border-top-style: solid;
        border-top-width: 2;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 750px;
    }

    .tabbar-item {
        flex: 1;
        justify-content: center;
        align-items: center;
        height: 98px;
    }

    .tabbar-item:active {
        background-color: #ccc;
    }

    .txt-box {
        justify-content: center;
        align-items: center;
        /*height: 60;*/
    }

    .txt-hidden {
        font-family: STHeitiSC-Light;
        font-size: 20px;
        color: #8496a2;
        letter-spacing: 0.2px;
        text-align: center;
    }

    .txt-visible {
        font-family: STHeitiSC-Light;
        font-size: 20px;
        color: #f76b1c;
        letter-spacing: 0.2px;
        text-align: center;
    }

    .container {
        flex: 1;
    }

    .content {
        background-color: #fff;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
    }

    .icon-box {
        justify-content: center;
        align-items: center;
    }

    .icon {
        border: 1px solid #8496a2;
        width: 44;
        height: 44;
    }
</style>
