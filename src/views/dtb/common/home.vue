<template>
    <div class="container"
         @viewappear="onviewappear">
        <list class="list" @scroll="onScroll">
            <cell class="list-cell">
                <slider class="slider" interval="3000" auto-play="true">
                    <div class="cm-border" v-for="(img, key) in banner_img_list" :key="key">
                        <image class="banner_img" resize="cover" :src="img.src" @click="bannerClicked(key)"></image>
                    </div>
                </slider>
            </cell>
            <cell v-for="(item, index) in arr_entry"
                  :key="index">
                <div class="entry-item">
                    <image class="entry-item-image" :src="item.src"></image>
                    <text class="entry-item-text">{{item.title}}</text>
                    <div class="entry-inner"
                         v-for="(data, i) in item.data"
                         @click="jumpPage(data.url)"
                         :key="i">
                        <div class="entry-inner-item"
                             :class="[item.title === '商户' && 'entry-inner-item-te']">
                            <text class="entry-inner-text">{{data.text}}</text>
                        </div>
                    </div>
                </div>
            </cell>
        </list>
        <div class="navi-bar" :style="{ backgroundColor: navbarBackColor, height: navbarHeight}">
            <text class="navi-title-txt" v-if="scrollDistance < 0">递推宝</text>
            <image class="nav-item-src" :src="src_msg_img" @click="jumpPage('dtb_mine_message_center')"></image>
        </div>
    </div>
</template>
<script>

    import source                       from 'helpers/source';
    import request                      from 'helpers/request';
    import toast                        from 'helpers/toast';
    import router                       from 'plugins/router';
    import auth                         from 'helpers/auth';
    import modal                        from 'plugins/modal';
    import channel                      from 'plugins/channel';
    import Api                          from 'api/entry.api'

    export default {
        components: {
            ddPage: require('dd-components/vue/dd-page.vue'),
        },
        data () {
            return {
                banner_img_list: [
                    {'src':source('home_Banner1.png')},
//                    {'src':source('home_Banner2.jpg')},
                ],
                role_id: [],
                scrollDistance: 0,
                navbarBackColor: 'rgba(0, 0, 0, 0.0)',
                navbarHeight: '88px',
                arr_role_auth: [],
                src_msg_img: source('jjlcsmcopy.png'),
                arr_entry: [
                    
                    {
                        title: '商户',
                        src: source('home-jfb-bus-entry-icon.png'),
                        data: [
                            {
                                text: '商户进件',
                                url: 'common_merchant',
                            },
                        ]
                    }
                ]
            }
        },
        methods: {
            jumpPage (push_page) {
                switch (push_page) {
                    case 'jfb_openforu_open':
                    case 'jfb_price_pricelist':
                    case 'price_pricelist':
                    case 'openforu_open':
                        if (this.queryPowerByRoleId('dpos')){
                            router.push(push_page)
                        } else {
                            toast('您没有该业务权限，请联系您的代理商');
                        }
                        break;
                    case 'common_merchant':
                        // 缓存角色权限
                        this.judgeUserAuth().then(() => {
                            return auth.getToken();
                        }).then((info) => {
                            if(!info.jfbpos) throw '';
                            router.push('entry', this.arr_role_auth);
                        }).catch(() => {
                            toast('您没有该业务权限，请联系您的代理商');
                        });
                        break;
                    default:
                        router.push(push_page);
                        break;
                }
            },
            // 商户进件判断业务员权限
            judgeUserAuth () {
                let cpos = '';
                let jfbpos = '';
                this.arr_role_auth && this.arr_role_auth.forEach((item, index) => {
                    if (item.productType === 'cpos') cpos = item;
                    if (item.productType === 'jfbpos') jfbpos = item;
                });
                return auth.update({ cpos, jfbpos });
            },
            queryPowerByRoleId ( role_str ) {
                var type = false;
                this.role_id.forEach( (item) => {
                    if(item == role_str) type = true;
                });
                return type;
            },
            bannerClicked(e) {
                if (e == 0) {
                    router.push('dtb_common_single_web', { link: source('webview.html?id=17'), title: '新手引导'});
                } else {
                    auth.getToken().then(info => {
                        router.push('dtb_common_webview', { link: `https://finumi.com/html/QR-code.html?jf_phone=${info.phoneNo}&appId=RFQ201691af`});
                    });
                }
            },
            onScroll(e) {
                this.scrollDistance = e.contentOffset.y;
                var cap = -e.contentOffset.y;
                this.navbarBackColor = `rgba(255, 255, 255, 1.0)`;
                if (cap <= 10) {
                    this.navbarBackColor = 'rgba(255, 255, 255, 0.0)';
                }
            },
            getInfo () {
                auth.getToken().then(info => {
                    var options = {
                        method: 'GET',
                        body: {
                            token: info.token
                        }
                    };
                    this.phone = info.phoneNo;
                    request('/v1/user/user_info', options).then(result => {
                        if (result.code !== '0000') return toast(result.msg);
                        this.role_id = result.data.roleId ? result.data.roleId : [];
                        auth.update(result.data).then(success => {
                            this.data = result.data;
                        }).catch(error => {
                            toast(error);
                        });
                    }).catch(error => {
                        return toast(error);
                    });
                }).catch(error => {
                    modal.show('dtb_user_login_new')
                });
            },

            // 获取业务员权限
            fetchUserAuthority () {
                auth.getToken().then((info) => {
                    var options = {
                        method: 'POST',
                        body: {
                            token: info.token,
                        },
                        loading: true
                    };
                    Api.fetchUserAuthority(options).then(result => {
                        let { code, msg, data } = result;
                        if (code !== '0000') throw msg;
                        this.arr_role_auth = data || [];
                    }).catch(() => {
                        this.arr_role_auth = []
                    });
                })
            },

            onviewappear() {
                this.getInfo();
                this.fetchUserAuthority();
            },
        },
        mounted() {
            channel.add('$$LOGINSUCCESS',e => {
                router.root();
            });
        },
        // 销毁 【清空相关内容】
        destroyed () {
            //销毁观察对象
            channel.remove('$$LOGINSUCCESS');
        },
        created () {
            var env = this.$getConfig().env;
            if (env.platform === 'iOS') {
                this.navbarHeight = '128px'
            } else {
                this.navbarHeight = '88px';
            }
        }
    }
</script>
<style>
    .present-container{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.3);
        flex-direction: column;
        justify-content: center;
        align-items: center
    }
    .chosse-border {
        border-radius:24px;
        width:710px;
        /*height:270px;*/
        position: absolute;
        bottom: 230px;
        right: 20px;
        background-color:#ffffff;
        transform-origin: center center;
    }
    .dib{
        height: 90px;
    }
    .btn-txt {
        font-size:40px;
        color:#0076ff;
        text-align:center;
    }
    .cancel {
        position: absolute;
        bottom: 110px;
        background-color:#ffffff;
        border-radius:24px;
        align-items: center;
        justify-content: center;
        width:710px;
        height:100px;
        right: 20px;
    }
    .dib {
        flex: 1;
        justify-content: center;
        border-top-width: 0.5px;
        border-top-color: #8f8e94;
    }
    .title {
        font-size:26px;
        color:#8f8e94;
        text-align:center;
    }
    .title-cancel {
        flex: 1;
        font-size:40px;
        color:#0076ff;
        text-align: center;
        height: 100px;
        padding-top: 30px;
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
        background-color: #eaedf2;
    }
    .list-cell {
        background-color: #fff;
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
    .slider {
        width: 750px;
        height: 430px;
        margin-bottom: 20px;
    }
    .cm-border {
        align-items: center;
        justify-content: center;
        width: 750px;
        height: 430px;
    }
    .banner_img {
        align-items: center;
        width: 750px;
        height: 430px;
    }
    .entry-item{
        width: 710px;
        margin-left: 20px;
        margin-right: 20px;
        height: 180px;
        margin-top: 10px;
        background-color: #fff;
        border-color: rgba(90,101,131,0.40);
        border-width: 1px;
        border-radius: 16px;
        flex-direction: row;
        align-items: center;
        padding-left: 40px;
        padding-right: 36px;
    }
    .entry-item-image{
        width: 80px;
        height: 80px;
        margin-right: 28px;
    }
    .entry-item-text{
        font-size: 32px;
        color: #4A4A4A;
        flex: 1;
    }
    .entry-inner{
        flex-direction: row;
        align-items: center;
    }
    .entry-inner-item{
        width: 160px;
        height: 64px;
        align-items: center;
        justify-content: center;
        border-radius: 32px;
        background-image: linear-gradient(to right, #3F72DE, #6C98FE);

        margin-left: 40px;
    }
    .entry-inner-item-te{
        background-image: linear-gradient(to right, #FC7E7B, #FE9F4D);
    }
    .entry-inner-text{
        font-size: 28px;
        color: #fff;
    }
</style>
