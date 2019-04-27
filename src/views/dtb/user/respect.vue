<template>
    <dd-page title="关于" :leftItemSrc="left_img" >
        <div class="respect_item">
            <image class="respect_img" :src="dtb"></image>
            <text class="respect_text">递推宝{{ current_version }}</text>
        </div>
    </dd-page>
</template>
<script>
    import router from 'plugins/router';
    import dialogs from 'plugins/dialogs';
    import request from 'helpers/request';
    import source from 'helpers/source';
    import system from 'plugins/system';
    import jf from 'helpers/jfservice';

    export default{

        components: {
            ddPage: require('dd-components/vue/dd-page.vue'),
            button: require('components/common/button.vue'),
        },
        data () {
            return {
                refereeName: '客服',
                refereePhone: '4007828888',
                current_version: '',
                new_version: '',
                os_type: '',
                new_version_msg: '',
                is_revise: false
            }
        },
        computed:{
            update() {
                return source('icon_update.png');
            },
            feedback() {
                return source('icon_feedback.png');
            },
            phone() {
                return source('icon_contact.png');
            },
            right() {
                return source('tkzh_3.png');
            },
            dtb() {
                return source('ic_launcher.png');
            }
        },
        mounted () {
            var env = this.$getConfig().env;
            this.current_version = env.appVersion;
            this.os_type = env.platform;
        },
        created () {
            var env = this.$getConfig().env;
            if (env.platform === 'iOS') {
                this.is_revise = false;
            } else {
                this.is_revise = true;
            }
        }
    }
</script>
<style>
    .respect_item{
        align-items: center;
        background-color: white;
        flex: 1;
        padding-top: 240px;
    }
    .respect_img{
        width: 100px;
        height: 100px;
    }
    .respect_text{
        margin-top: 15px;
        font-size: 30px;
        color: #5d697a;
    }
    .respect_main{
        margin-top: 50px;
    }
    .respect_main_item{
        background-color: #fff;
        height: 100px;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-bottom-color: lightgrey;
        align-items: center;
        padding-left: 30px;
        flex-direction: row;

    }
    .respect_img1{
        width: 50px;
        height: 50px;

    }
    .respect_item_text{
        padding-left: 10px;
        font-size: 26px;
        color: #5d697a;
        flex:1;
    }
    .respect_img2{
        width: 30px;
        height: 30px;
        margin-right: 30px;
    }
</style>
