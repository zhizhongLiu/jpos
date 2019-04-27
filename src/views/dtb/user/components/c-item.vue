<template>
  <div class="item" @click="onclickitem" >
    <text class="txt">{{title}}</text>
    <div class="item-right">
      <text :class="['txt-low', 'txt-low-' + color]">{{note}}</text>
      <image :class="['icon', 'icon-sz-' + size]"  :src="rightImg || right_image"></image>
    </div>
  </div>
</template>
<script>
import source from 'helpers/source';

module.exports = {
  props: {
    //条目左侧文字
    title: { default: '' },
    //条目右侧
    note: { default: '' },

    rightImg: { default: '' },

    size: { default: 'default' },

    color: { default: 'primary' },
  },
  methods: {
    onclickitem (e) {
      this.$emit('onItemClick');
    }
  },
  computed: {
    right_image () {
      return source('tkzh_3.png');
    }
  }
}
</script>
<style>
.item {
  justify-content: flex-start;;
  flex-direction: row;
  align-items: center;
  background-color: white;
  border-bottom-width: 1;
  border-bottom-style: solid;
  height: 90;
  border-bottom-color: #e5e5e5;
}
.item:active {
  background-color: #f2f2f2;
}
.item-right {
  position: absolute;
  right: 30;
  height: 90;
  justify-content: center;
  flex-direction: row;
  align-items: center;
}
.txt {
  color: #4a4a4a;
  font-size: 30;
  margin-left: 30px;
}
.txt-low {
  font-size: 30;
  color: #bbbbbb;
}
.txt-low-black {
  color: black;
}

/*icon*/
.icon {
  width: 20px;
  height: 20px;
  margin-left: 15px;
}
.icon-sz-large {
  width: 60px;
  height: 60px;
  margin-left: 30px;
}
.icon-sz-small {
  width: 40px;
  height: 40px;
  margin-left: 20px;
}
</style>
