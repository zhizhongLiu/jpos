<template>
    <div @viewappear="onviewappear">
        <list class="list">
            <cell class="user" @click="user_click">
                <image :src="auth.photoUrl ? auth.photoUrl : default_img" class="user-img"></image>
                <div class="user-center">
                    <div class="user-top">
                        <text class="user-name">{{auth.realName | filterName}}</text>
                        <image v-if="auth.open" :src="open_img" class="diamond-icon"></image>
                        <image v-if="auth.recruit" :src="recruit_img" class="user-icon"></image>
                        <image v-if="auth.guarantee" :src="guarantee_img" class="user-icon"></image>
                    </div>
                    <text class="phone">{{auth.phoneNo | phoneFilter}}</text>
                </div>
                <image :src="right_img" class="right-img"></image>
            </cell>
            <cell class="list-item" v-for="(item, index) in data" :key="index">
                <div class="list-item-inner" @click="jump(item.txt, item.src, item.url)">
                    <image class="icon" :src="item.icon"></image>
                    <text class="title">{{item.txt}}</text>
                </div>
            </cell>
            <cell class="top">
                <button text="安全退出"  @btnClick="secede"></button>
            </cell>
        </list>
    </div>
</template>

<script>
    import source         from 'helpers/source'
    import auth           from 'helpers/auth'
    import request        from 'helpers/request'
    import toast          from 'helpers/toast'
    import router         from 'plugins/router'
    import jf             from 'helpers/jfservice'
    import dialogs        from 'plugins/dialogs'
    import system         from 'plugins/system'
    import modal          from 'plugins/modal'
    import FilterMixin    from 'mixins/filter.mixin'

    export default {
        mixins: [FilterMixin],
        computed: {
            recruit_img() {
                return source('scopy4.png');
            },
            open_img() {
                return source('scopy2.png');
            },
            guarantee_img() {
                return source('scopy3.png');
            },
            right_img() {
                return source('scopy5.png');
            },
            default_img() {
                return source('grzx_2.png');
            }
        },
        components: {
            ddPage: require('dd-components/vue/dd-page.vue'),
            button: require('components/common/button.vue'),
        },
        data() {
            return {
                data: [
                    {
                        icon: source('khgl.png'),
                        txt: '我的客户111222',
                        src: 'dtb_common_crm',
                    },
//                    {
//                        icon: source('icon_update.png'),
//                        txt: '版本更新',
//                    },
                    {
                        icon: source('icon_feedback.png'),
                        txt: '反馈意见',
                        src: 'dtb_user_suggest'
                    },
                    {
                        icon: source('icon_contact.png'),
                        txt: '客服电话',
                    },
                    {
                        icon: source('about.png'),
                        txt: '关于',
                        src: 'dtb_user_respect',
                    },
                    {
                        icon: source('setting.png'),
                        txt: '设置',
                        src: 'dtb_user_setting',
                    },
                ],
                auth: {}
            }
        },
        filters: {
            phoneFilter (value) {
                return value ? value.substring(0,3) + '****' + value.substring(7) : '';
            }
        },
        methods: {
            secede () {
                auth.logout().finally(() => {
//                    router.pop();
                    modal.show('dtb_user_login')
                });
            },
            user_click() {
                router.push('dtb_mine_user_setting')
            },
            jump(txt, src, url) {
                switch (txt) {
                    case '版本更新':
                        jf.isUpdate();
                        break;
                    case '客服电话':
                        dialogs.confirm({
                            message: '客服4007828888',
                            okTitle: "取消",
                            cancelTitle: "立即拨打"
                        },result => {
                            result === "立即拨打" ? system.callTel(this.refereePhone) : null;
                        });
                        break;
                    case '':
                        break;
                    default:
                        router.push(src);
                        break;
                }
            },
            // 获取用户信息，并更新
            getAuth() {
                auth.getToken()
                    .then(info => {
                        this.auth = info;
                        return request('/v1/user/user_info', {
                            method: 'GET',
                            loading: true,
                            body: {
                                token: info.token
                            }
                        });
                    })
                    .then(result => {
                        if (result.code != '0000') throw result.msg;
                        return auth.update(result.data);
                    })
                    .then(info => this.auth = info)
            },
            onviewappear() {
                this.getAuth();
            }
        }
    }
</script>

<style>
    .top {
        padding-top: 50px;
        padding-bottom: 150px;
    }
    .list {
        width: 750px;
        background-color: #eee;
    }
    .user {
        flex-direction: row;
        align-items: center;
        background-image: linear-gradient(to right, #F9CA54, #F76C1B);
        height: 348px;
    }
    .user-center {
        margin-left: 26px;
        height: 136px;
        justify-content: center;
    }
    .user-top {
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }
    .user-name {
        font-family: STHeitiSC-Light;
        font-size: 34px;
        color: #ffffff;
    }
    .user-icon {
        width: 32px;
        height: 32px;
        margin-left: 20px;
    }
    .diamond-icon {
        background: rgba(255, 255, 255, 0.72);
        width: 34px;
        height: 32px;
        margin-left: 30px;
    }
    .phone {
        margin-top: 5px;
        font-family: HelveticaNeueDeskInterface-Regular;
        font-size: 30px;
        color: #ffffff;
        text-align: left;
    }
    .user-img {
        background: rgba(255, 255, 255, 0.50);
        border-color: rgba(255, 255, 255, 0.60);
        border-style: solid;
        border-width: 2px;
        border-radius: 100px;
        width: 132px;
        height: 132px;
        margin-left: 30px;
    }
    .right-img {
        position: absolute;
        top: 156px;
        right: 28px;
        width: 16px;
        height: 26px;
    }
    .part {
        margin-top: 60px;
    }
    .itembox {
        padding-top: 20px;
    }
    .row {
        flex-direction: row;
        width: 750px;
    }
    .item {
        flex: 1;
        flex-direction: row;
        align-items: center;
        height: 160px;
        background-color: #fff;
        border-right-color: #e5e5e5;
        border-bottom-color: #e5e5e5;
        border-right-width: 2px;
        border-bottom-width: 2px;
        border-right-style: solid;
        border-bottom-style: solid;
    }
    .item:active {
        background-color: #f2f2f2;
    }
    .icon {
        width: 52px;
        height: 52px;
        margin-left: 70px;
    }
    .title {
        font-family:STHeitiSC-Light;
        color: #333;
        font-size: 32px;
        margin-left: 44px;
    }
    .noshow {
        background-color: #eee;
        border-bottom-color: transparent;
    }
    .noshow:active {
        background-color: #eee;
    }
    .list-item{

    }
    .list-item-inner{
        flex: 1;
        height: 120px;
        flex-direction: row;
        align-items: center;
        background-color: #fff;
        border-color: #ddd;
        border-bottom-width: 2px;
    }
</style>
