<template>
  <div
    :style="{height: itemHeight}"
    class="container">
    <div
      :style="{backgroundColor: background}"
      class="placeholder"></div>
    <image
      :src="icon"
      :class="['tab-icon-' + pattern]"
      @click="onclickitem"></image>
    <text
      :style="{ color: titleColor }"
      class="tab-text">{{title}}</text>
  </div>  
</template>

<style>
  .container {
    flex: 1; 
    flex-direction: column; 
    align-items: center; 
    justify-content: flex-end; 
    padding-bottom: 10;
  }
  .placeholder {
    width: 750;
    height: 98;
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    border-top-width: 2;
    border-top-color: #e5e5e5;
  }
  .tab-icon {
    width: 45;
    height: 45;
  }
  .tab-icon-normal {
    width: 45;
    height: 45;
  }
  .tab-icon-special {
    width: 90; 
    height: 90;
  }
  .tab-text {
    margin-top: 5; 
    text-align: center;  
    font-size: 20;
  }
</style>

<script>
  export default {
    props: {
      index: { default: 0 },
      title: { default: '' },
      titleColor: { default: '#000000' },
      icon: { default: '' },
      background: { default: '#ffffff' },
      pattern: { default: 'normal' }, //normal special
    },
    computed: {
      itemHeight: function () {
        return this.pattern === 'normal' ? '98' : '118';
      }
    },
    methods: {
      onclickitem: function (e) {
        var params = {
          index: this.index
        };
        this.$emit('tabItemOnClick', params);
      }
    }
  }
</script>
