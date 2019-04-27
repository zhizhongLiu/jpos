<template>
  <div class="container">
    <div v-for="(row, i) in list" :key="i" class="row">
      <div v-for="(item, k) in row" :key="k" @click="onclick(item,$event)" class="item" :style="{ height: 200 * scale + 'px' }">
        <image class="icon" :src="item.icon" :style="{ height: 65 * scale + 'px', width: 65 * scale + 'px' }"></image>
        <text class="title">{{item.title}}</text>
      </div>
    </div>
  </div>
</template>

<script>
  import { d2 } from '../utils';
  import toast from 'helpers/toast';
  import router from 'plugins/router';
  import auth from 'helpers/auth';

  export default {
    props: {
      data: { default: [] },
      options: {
        default: {
          type: 'normal',
          each: 2,
        }
      }
    },

    computed: {
      list() {
        return d2(this.data, this.options.each);
      },
      scale() {
        var size = { normal: 1, larger: 1.2, large: 1.5 };
        var key = this.options && this.options.type || 'normal';
        return size[key];
      }
    },

    methods: {
      onclick(item,$event) {
        this._middleware(item.action);
        if (item.title === '自由定价') return this.$emit('action', $event);
//        if (item.title == '自由定价') return this.$emit('jumpPage', 'price');
        if (item.title === '商户进件') return this.$emit('jumpPage', item.action[0].push);
        if (item.title === '软件下载') return this.$emit('jumpPage', 'dtb_common_single_web');
        if (item.title === '替你开通') return this.$emit('open', $event);
      },
      _async(action) {
        if (action.push === 'price_pricelist' || action.push === 'openforu_open' || action.push === 'merchant_opensubstitute' ||
            action.push === 'dtb_common_single_web' || action.push === 'common_merchant_entry') {
          //处理自由定价点击事件不跳转
        } else if(action.push){
          router.push(action.push);
        } else if (action.link) {
          this._linking(action.link).then(link => {
            router.push('dtb_common_webview', { link: link });
          })
        }
        return Promise.resolve();
      },

      _linking(string) {
        return auth.getToken().then(info => {
          string = string.replace(/\$\{PHONE\}/g, info.phoneNo);
          string = string.replace(/\$\{APPID\}/g, 'RFQ201691af');
          return Promise.resolve(string);
        })
      },

      _middleware(middleware) {
        if (!this._check(middleware)) return null;
        this._async(middleware[0]).then(success => {
          middleware = middleware.slice(1, middleware.length)
          this._middleware(middleware);
        }).catch(error => {
          toast(error)
        });
      },

      _check(value) {
        return Object.prototype.toString.call(value).toLowerCase().indexOf('array') !== -1 && value.length !== 0;
      }
    },
  }
</script>

<style>
  .container {
    width: 750px;
  }
  .row {
    background-color: white;
    flex-direction: row;
    width: 750;
  }
  .item {
    flex: 1;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: white;
    border-bottom-width: 2px;
    border-bottom-color: #efefef;
    border-right-width: 2px;
    border-right-color: #efefef;

  }
  .item:active {
    background-color: #f2f2f2;
  }
  .icon {
    width: 100px;
    height: 100px;
  }
  .title {
    color: #596d7a;
    font-size: 36px;
    margin-left: 15px;
  }
</style>
