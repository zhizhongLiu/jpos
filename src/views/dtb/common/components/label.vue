<template>
  <div class="container">
    <image class="icon" :src="icon"></image>
    <div :class="['line', focus && 'focus']" :style="{ width: width }">
      <ddsecrityinput
        :type="type"
        :placeholder="placeholder"
        class="input"
        :value="value"
        @input="oninput"
        @change="onchange"
        @focus="onfocus"
        @blur="onblur"
        :clearmode="clearmode"
        :random="random"
        :style="{ width: width - inputWidth }"
      ></ddsecrityinput>
      <div ref="box">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<style>
  .container {
    height: 100px;
    width: 750px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-bottom-width: 1px;
    border-bottom-color: #e9e9e9;
  }
  .icon {
    width: 52px;
    height: 52px;
    margin-right: 10px;
  }
  .line {
    flex-direction: row;
    align-items: flex-end;
    height: 100px;
    justify-content: space-between;
    
  }
  .input {
    font-size: 32px;
    height: 100px;
    justify-content: center;
    align-items: center;
    text-indent: 20px;
  }
  .red {
    color: #f00;
  }
</style>
<script>
  const dom = weex.requireModule('dom');

  export default {
    props: {
      icon: { default: '' },
      type: { default: '' },
      placeholder: { default: '' },
      value: { default: '' },
      clearmode: { default: 'whileedit' },
      random: { default: false },
      width: { default: 580 },
      inputWidth: { default: 0 },
      red: { default: ''}
    },
    data: function () {
      return {
        focus: false
      }
    },

    mounted: function () {
      var self = this;
      setTimeout(function() {
        dom.getComponentRect(self.$refs.box, function (option) {
          self.inputWidth = option.size.width;
        });
      }, 100);
    },

    methods: {
      oninput: function (e) {
        this.$emit('input', e);
      },
      onchange: function (e) {
        this.$emit('change', e);
      },
      onfocus: function (e) {
        this.focus = true;
      },
      onblur: function (e) {
        this.focus = false;
      }
    }
  }
</script>