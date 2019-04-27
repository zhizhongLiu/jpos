<template>
  <dd-navpage
    dataRole="none"
    :height="navBarHeight"
    :title="title"
    :backgroundColor="backgroundColor"
    :titleColor="titleColor"
    :leftItemSrc="_leftItemSrc"
    :leftItemTitle="leftItemTitle"
    :leftItemColor="leftItemColor"
    :rightItemSrc="rightItemSrc"
    :rightItemTitle="rightItemTitle"
    :rightItemColor="rightItemColor"
    :type="type"
    @naviBarLeftItemClick="naviBarLeftItemClick"
    @naviBarRightItemClick="naviBarRightItemClick">
    <slot></slot>
  </dd-navpage>
</template>

<script>
  import router from 'plugins/router';
  import statusbar from 'plugins/statusbar';
  import source from '../../helpers/source'

  export default {
    props: {
      //导航条背景色
      backgroundColor: { default: '#ffffff' },
      //导航条标题
      title: { default: '' },
      //导航条标题颜色
      titleColor: { default: '#000' },
      //右侧按钮图片
      rightItemSrc: { default: '' },
      //右侧按钮标题
      rightItemTitle: { default: '' },
      //右侧按钮标题颜色
      rightItemColor: { default: '#000' },
      //右侧点击事件冒泡
      // rightItemClick: { default: '' },
      //左侧按钮图片
      leftItemSrc: { default: source('jyfl_1.png') },
      //左侧按钮标题
      leftItemTitle: { default: '' },
      //左侧按钮颜色
      leftItemColor: { default: '#000' },
      //左侧点击事件冒泡
      onleftItemClick: { default: '' },
      //扩展样式
      type: { default: 'default' }, // default, clear, avatar, icon
    },

    computed: {
      _leftItemSrc: function () {
        return this.type === 'clear' ? '' : this.leftItemSrc;
      }
    },

    data: function () {
      return {
        navBarHeight: 0,
      }
    },

    components: {
      ddNavpage: require('./dd-navpage.vue'),
    },

    created: function() {
      var env = this.$getConfig().env;
      if (env.platform === 'iOS') {
        var scale = env.scale;
        var deviceWidth = env.deviceWidth / scale;
        var is_iphoneX = [
          'iPhone10,3', 
          'iPhone10,6',
          'iPhone11,2',
          'iPhone11,4',
          'iPhone11,8'
        ].indexOf(this.$getConfig().env.deviceModel) > -1;
        if(is_iphoneX){
            this.navBarHeight = 88.0 * 750.0 / deviceWidth;
        }else{
            this.navBarHeight = 64.0 * 750.0 / deviceWidth;
        }
// +       this.navBarHeight = is_iphoneX ? 88.0 * 750.0 / deviceWidth : 64.0 * 750.0 / deviceWidth;
      } else {
        this.navBarHeight = 88;
        statusbar.color('#000000');
      }
    },

    methods: {
      naviBarLeftItemClick: function (e) {
        if (['icon', 'avatar'].indexOf(this.type) != -1) return this.$emit('leftItemClick', e);
        if (this.leftItemSrc) return router.pop();
      },

      naviBarRightItemClick: function (e) {
        this.$emit('rightItemClick', e)
      },
    },
  }
</script>
