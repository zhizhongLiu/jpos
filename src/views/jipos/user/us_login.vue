<template>
    <div class="body">
        <div class="portraitBody">
            <image class = "portrait" :src="wode"></image>
        </div>
        <div class="div top">
            <image :src="iPhone" class="img"></image>
            <ddsecrityinput
                class="input"
                maxlength="11"
                type="tel"
                placeholder="请输入手机号"
                :value="phone"
                @input='onPhone'
                clearmode="whileedit"
            ></ddsecrityinput>
        </div>
        <div class="div top1">
            <image :src="suo" class="img"></image>
            <ddsecrityinput
                class="input"
                type="password"
                placeholder="请输入密码"
                :value="password"
                @input='onPassword'
                clearmode="whileedit"
            ></ddsecrityinput>
        </div>
        <div class="forgot">
            <text class="txt" @click="forgot">忘记密码</text>
        </div>
        <div class="btn" @click="login">
            <text class="txt">登 录</text>
        </div>
    </div>
</template>
<script>
    import source from 'helpers/source';
    import request from 'helpers/request';
    import toast from 'helpers/toast';
    import router from 'plugins/router';
    import auth from 'helpers/auth';
    import regx from 'helpers/regx';
    import jf from 'helpers/jfservice';
    import modal from 'plugins/modal';
    import channel from 'plugins/channel';
    import Store from 'utils/store'

    const USER_ACCOUNT_KEY = 'USER_ACCOUNT_KEY';

    export default {
        data () {
            return {
                phone: '',
                password: ''
            }
        },
        computed: {
            wode () {
                return source('icon_logo.png');
            },
            iPhone () {
                return source('icon_account.png');
            },
            suo () {
                return source('icon_pwd.png');
            }
        },
        created () {
            /*
            * 本地缓存获取USER_ACCOUNT_KEY，
            * this.phone = 手机号
            * */
            this.getHistoryAccount();
        },
        methods: {
            getHistoryAccount() {
                Store.get(USER_ACCOUNT_KEY).then((result) => {
                    this.phone = result;
                }).catch(() => {
                    this.phone = '';
                })
            },
            // 存储用户手机号USER_ACCOUNT_KEY
            setHistoryAccount() {
                Store.set(USER_ACCOUNT_KEY, this.phone);
            },

            login () {
                if (!this.phone) {
                    return toast('请输入手机号!');
                }else if (!regx.isPhone(this.phone)) {
                    return toast("请输入正确的手机号!");
                }else if (!this.password) {
                    return toast("请输入密码");
                }else {
                    router.push('jipos_user_us_setting_password');
                    // modal.show('jipos_user_us_setting_password');
                    // jf.getUUID(this.phone).then(uuid =>  {
                    //     var req = {
                    //         mobile: this.phone,
                    //         password: this.password,
                    //         uuid: uuid
                    //     };
                    //     var options = {
                    //         method: 'POST',
                    //         body: req,
                    //         loading: true
                    //     };
                    //     request('/v1/user/login', options).then(result => {
                    //         if (result.code != '0000') return toast(result.msg);
                    //         auth.login({
                    //             phoneNo: this.phone,
                    //             token: result.data
                    //         }).then(success => {
                    //             // 存储用户手机号USER_ACCOUNT_KEY
                    //             this.setHistoryAccount();
                    //             channel.post('$$LOGINSUCCESS', {});
                    //             modal.close();
                    //         }).catch(error => {
                    //             toast(error);
                    //         });
                    //         // toast(result.msg);
                    //     }).catch(error => {
                    //         return toast(error);
                    //     });
                    // });
                }
            },
            onPhone (e) {
                this.phone = e.value;
            },
            onPassword (e) {
                this.password = e.value;
            },
            forgot () {
                router.push('common_reset_pwd');
            }
        }
    }
</script>
<style>
    .body {
        /*background-image: linear-gradient(to right,#3091ad,#6dc7e1);*/
        background-color: #3091ad;
    }
    .portrait{
        align-items: center;
        width: 220px;
        height: 220px;
        border-radius:75px;
    }
    .portraitBody{
        align-items: center;
        margin-top: 180px;
        margin-left: 150px;
        margin-right: 150px;
        overflow: hidden;
    }
    .top {
        margin-top: 80px;
    }
    .top1 {
        margin-top: 20px;
    }
    .div {
        padding-left: 30px;
        border-radius:50px;
        width: 650px;
        height: 100px;
        margin-left: 50px;
        margin-right: 50px;
        justify-content: flex-start;
        align-items: center;
        flex-direction: row;
        background-color: rgba(24,108,128,0.5);
    }
    .img {
        width: 60px;
        height: 60px;
    }
    .input {
        height: 100px;
        width: 500px;
        text-align: left;
        font-size: 32px;
        color: #fff;
        margin-left: 10px;
    }
    .btn {
        position: absolute;
        bottom: 150px;
        border-radius:50px;
        width: 550px;
        height: 100px;
        margin-left: 100px;
        margin-right: 100px;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        background-color: rgba(24,108,128,0.5);
    }
    .txt {
        color: #fff;
        font-size: 34px;
    }
    .forgot {
        margin-left: 90px;
        margin-right: 90px;
        margin-top: 15px;
        align-items: flex-end;
    }
    .log_img {
        width: 40px;
        height: 40px;
        margin: 50px;
    }
</style>
