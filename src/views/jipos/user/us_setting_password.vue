<template>
    <dd-page :title="title">
        <div class="body">
            <div class="box drm top1">
                <text class="txt">设置密码</text>
                <input class="input" type="text" placeholder="请输入密码"></input>
            </div>
            <div class="vline"></div>
            <div class="box drm">
                <text class="txt">再次确认</text>
                <input class="input" type="text" placeholder="请输再次输入密码"></input>
            </div>

            <div>
                <text class="tiptxt" >{{tipsContent}}</text>
            </div>

            <div class="btn" @click="confrimBtn">
                <text class="btntxt">确 认</text>
            </div>
        </div>
    </dd-page>
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

  export default {
    name: 'SettingPassword',
    components: {
        ddPage: require('dd-components/vue/dd-page.vue'),
    },
    data () {
      return {
        tipsContent: '温馨提示：首次登录需要设置密码',
          title: '设置密码'
      }
    },
    methods: {
          confrimBtn(){
              router.push("jipos_common_us_iframe");
          }
     }
  }
</script>

<style scoped>

    .body {
        background-color: #f5f5f5;
    }

    .top1 {
        margin-top: 20px;
    }

    .box {
        background-color: #ffffff;
        width: 750px;
        height: 100px;
        padding-left: 30px;
        padding-right: 30px;
        justify-content: flex-start;
        align-items: center;
        flex-direction: row;
    }

    .drm {
        direction: ltr;
    }

    .input {
        height: 100px;
        text-align: right;
        font-size: 30px;
        width: 510px;
        color: #666666;
        margin-left: 10px;
        placeholder-color: #CCCCCC;
    }

    .txt {
        color: #666666;
        font-size: 30px;
        width: 150px;
    }
    .tiptxt {
        color: #CCCCCC;
        font-size: 24px;
        margin-top: 8px;
        margin-left: 30px;
    }

    .btn {
        margin-top: 120px;
        width: 600px;
        height: 72px;
        border-radius:36px;
        margin-left: 75px;
        margin-right: 75px;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        background-color: #f09d37;
    }
    .btntxt {
        color: white;
        font-size: 30px;
    }

    .vline {
        margin-left: 30px;
        height: 1px;
        width: 720px;
        background-color: #eee;
    }



</style>
