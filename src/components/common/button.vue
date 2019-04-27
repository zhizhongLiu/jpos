<template>
  <div :class="['btn', 'btn-color-' + color, 'btn-sz-' + size, 'btn-type-' + type, 'btn-outline-' + (outline ? color : ''), 'margin-' + margin, disable && 'disable']" @click="handleClick">
    <image v-if="icon" :class="['icon', 'icon-sz-' + size]" :src="icon"></image>
    <text v-if="text" :class="['txt', 'txt-sz-' + size, 'txt-color-' + color, 'txt-outline-' + (outline ? color : '')]">{{text}}</text>
  </div>
</template>

<script>
  import Defer from 'utils/defer/defer';
  const defer = new Defer(1000);

  export default {
    props: {
      color: { default: 'primary' },
      type: { default: 'default' },
      size: { default: 'default' },
      outline: { default: false },
      icon: { default: '' },
      text: { default: '' },
      disable: { default: false },
      margin: { default: 'default' }
    },
    data: function () {
      return {
        timer: ''
      }
    },
    methods: {
      handleClick: function (e) {
        if (!defer.do(this.timer)) return null;
        if (this.disable) return null;
        this.$emit('btnClick', e);
      }
    },
    created: function () {
      this.timer = 'defer' + new Date().getTime();
    }
  }

</script>

<style>
  .btn {
    height: 88px;
    align-items: center;
    justify-content: center;
    border-radius: 50px;
  }

  .disable {
    background-color: #ccc;
  }
  .disable:active {
    background-color: #ccc;
  }

  /*color*/
  .btn-color-primary {
    background-color: #f19d37;
  }
  .btn-color-primary:active {
    background-color: #f2ae5a;
  }
  .btn-color-secondary {
    background-color: #32db64;
  }
  .btn-color-danger {
    background-color: #f53d3d;
  }
  .btn-color-light {
    background-color: #f4f4f4;
  }
  .btn-color-dark {
    background-color: #222;
  }

  .txt-color-primary {
    color: #fff;
  }
  .txt-color-secondary {
    color: #fff;
  }
  .txt-color-danger {
    color: #fff;
  }
  .txt-color-light {
    color: #000;
  }
  .txt-color-dark {
    color: #fff;
  }

  .margin-default {
    margin-top: 30px;
    margin-bottom: 30px;
    margin-left: 70px;
    margin-right: 70px;
  }

  .margin-small {
    margin-top: 20px;
    margin-bottom: 20px;
    margin-left: 70px;
    margin-right: 70px;
  }

  /*size*/
  .btn-sz-large {
    padding-left: 50px;
    padding-right: 50px;
    padding-top: 30px;
    padding-bottom: 30px;
  }
  .btn-sz-default {
    padding-left: 30px;
    padding-right: 30px;
    padding-top: 20px;
    padding-bottom: 20px;
  }
  .btn-sz-small {
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  /*type*/
  .btn-type-block {
    border-radius: 10px;
  }
  .btn-type-round {
    border-radius: 1000px;
  }
  .btn-type-full {
    border-left: 0;
    border-right: 0;
  }

  /*outline*/
  .btn-outline-primary {
    background-color: transparent;
    border-color: #f19d37;
    border-width: 2;
  }
  .btn-outline-primary:active {
    background-color: #e5e5e5;
  }
  .btn-outline-secondary {
    background-color: transparent;
    border-color: #32db64;
    border-width: 2;
  }
  .btn-outline-danger {
    background-color: transparent;
    border-color: #f53d3d;
    border-width: 2;
  }
  .btn-outline-danger:active {
    background-color: #e5e5e5;
  }
  .btn-outline-light {
    background-color: transparent;
    border-color: #f4f4f4;
    border-width: 2;
  }
  .btn-outline-dark {
    background-color: transparent;
    border-color: #222;
    border-width: 2;
  }

  .txt-outline-primary {
    color: #f19d37;
  }
  .txt-outline-secondary {
    color: #32db64;
  }
  .txt-outline-danger {
    color: #f53d3d;
  }
  .txt-outline-light {
    color: #f4f4f4;
  }
  .txt-outline-dark {
    color: #222;
  }

  /*text-size*/
  .txt-sz-large {
    font-size: 45px;
  }
  .txt-sz-small {
    font-size: 18px;
  }

  /*icon*/
  .icon {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }
  .icon-sz-large {
    width: 60px;
    height: 60px;
    margin-right: 15px;
  }
  .icon-sz-small {
    width: 30px;
    height: 30px;
    margin-right: 8px;
  }
  .txt {
    font-size: 36px;
  }
</style>
