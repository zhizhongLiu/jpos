<template>

    <div class="body">
        <!--业务入口-->
        <div class="md-entry">
            <div class="vlin"></div>
            <div class="app-box" v-for="(app, j) in apps" :key="j">
                <image class="app-icon" :src="app.icon"></image>
                <text class="app-title">{{app.title}}</text>
            </div>
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

  export default {
    name: 'us_home',

    data () {
      return {
        apps: [
          { title: '额度查询', icon: 'https://gw.alicdn.com/tfs/TB1wKS.h8fH8KJjy1XbXXbLdXXa-140-140.png_150x10000.jpg' },
          { title: '交易记录', icon: 'https://gw.alicdn.com/tfs/TB1oM1qaMvD8KJjy0FlXXagBFXa-140-140.png_150x10000.jpg' }
        ]
      }
    }
  }
</script>

<style scoped>

    .body {
        background-color: #fff;
    }
    /*业务入口*/
    .md-entry {
        margin-top: 30px;
        margin-left: 30px;
        width: 690px;
        flex-direction: row;
        justify-content: space-around;
        background-color: #FFF;
    }
    .app-box {
        width: 345px;
        padding: 15px;
        align-items: center;
        border-right-width: 1px;
        border-color: #eee;
    }
    .app-title {
        font-size: 28px;
        text-align: center;
        padding-top: 15px;
        color: #333;
    }
    .app-icon {
        width: 120px;
        height: 120px;
    }

</style>
