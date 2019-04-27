<template>
   <dd-page :title="title" :type="type">
    <div class="body">
        <!--轮播图-->
        <div class="md-banner">
            <slider class="slider size" auto-play="true">
                <div v-for="(src, k) in imageUrls" :key="k">
                    <image class="size" resize="cover" :src="src"></image>
                </div>
                <indicator class="indicator"></indicator>
            </slider>
        </div>
        <!--业务入口-->
        <div class="md-entry">
            <div class="app-cell-vline" v-for="(app, k) in apps" :key="k">
                <div class="app-box app-hline" v-for="(item, j) in app" :key="j">
                    <image class="app-icon" :src="item.icon"></image>
                    <text class="app-title">{{item.title}}</text>
                </div>
            </div>
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
    name: 'us_home',
    title: '首页',
    type: 'clear',
    components: {
       ddPage: require('dd-components/vue/dd-page.vue'),
    },
    data () {
      return {
        imageUrls: [
          'https://gw.alicdn.com/tfs/TB1TKvQk79WBuNjSspeXXaz5VXa-900-1312.jpg',
          'https://gw.alicdn.com/tfs/TB1nDsrkYSYBuNjSspfXXcZCpXa-1080-1575.jpg',
          'https://gw.alicdn.com/tfs/TB1MqHJkVuWBuNjSszbXXcS7FXa-1080-1574.jpg',
          'https://gw.alicdn.com/tfs/TB1u1gjkY1YBuNjSszhXXcUsFXa-1080-1518.jpg'
        ],
        apps: [
          [{ title: '认证中心', icon: 'https://gw.alicdn.com/tfs/TB1wKS.h8fH8KJjy1XbXXbLdXXa-140-140.png_150x10000.jpg' },
            { title: '信用卡认证', icon: 'https://gw.alicdn.com/tfs/TB1oM1qaMvD8KJjy0FlXXagBFXa-140-140.png_150x10000.jpg' }],
          [{ title: '终端管理', icon: 'https://gw.alicdn.com/tfs/TB1Oiz0b22H8KJjy0FcXXaDlFXa-140-140.png_150x10000.jpg' },
            { title: '惠普商户', icon: 'https://gw.alicdn.com/tfs/TB1LhJzQFXXXXabXXXXXXXXXXXX-140-140.png_150x10000.jpg' }]
        ]
      }
    },
  }
</script>

<style scoped>

    .body {
        background-color: #fff;
    }

    /*轮播*/
    .md-banner {
        width: 690px;
        height: 320px;
        margin-left: 30px;
        margin-top: 20px;
        justify-content:center;
        border-radius: 10px;
    }

    .size {
        width: 690px;
        height: 320px;
        border-radius: 10px;
    }
    .slider {
        position: relative;
        border-radius: 10px;
    }
    .indicator {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 60px;
        background-color: rgba(0, 0, 0, 0.3);
        itemColor: #DDDDDD;
        itemSelectedColor: rgb(0, 180, 255);
    }

    /*业务入口*/
    .md-entry {
        margin-top: 30px;
        margin-left: 30px;
        width: 690px;
    }

    .app-cell {
        width: 690px;
        flex-direction: row;
        justify-content: space-around;
        background-color: #FFF;

    }
    .app-cell-vline {
        width: 690px;
        flex-direction: row;
        justify-content: space-around;
        background-color: #FFF;
        border-color: #eee;
        border-bottom-width: 1px;
    }

    .app-hline {
        border-color: #eee;
        border-right-width: 1px;
    }

    .app-box {
        width: 345px;
        padding: 15px;
        align-items: center;
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
