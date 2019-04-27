<template>
  <div :class="['code', 'btn-color-' + color, cut && 'code-disable', noradius && 'noradius']" @click="handleClick">
    <text :class="['code-txt', cut && 'code-disable-txt']">{{cut ? '等待' + cut + '秒' : value}}</text>
  </div>
</template>
<style>
.code {
  border-width: 2px;
  border-color: #0076FF;
  border-radius: 40px;
  align-items: center;
  justify-content: center;
  background-color: white;
}
.btn-color-primary {
  background-color: #f09d37;
}

/*.btn-color-primary:active {
  background-color: #f2ae5a;
}*/
.noradius {
  border-radius: 0px;
  border-width: 0px;
  border-color: transparent;
}

.code-disable {
  border-color: #989898;
  background-color: #989898;
}

.code-txt {
  font-size: 28px;
  color: #fff;
}

.code-disable-txt {
  color: #ccc;
}


</style>
<script>
import toast from 'helpers/toast';
import regx from 'helpers/regx';

export default {
  props: {
    time: { default: 30 },
    check: { default: '' },
    message: { default: '请输入手机号！' },
    color: { default: 'primary' },
    noradius: { default: false },
    value: { default: '' },
    async: { default: false },
  },

  data: function () {
    return {
      timer: '',
      cut: 0
    }
  },

  methods: {
    handleClick: function (e) {
      // 校验
      if (!regx.isPhone(this.check)) return toast(this.message);

      // 进度
      if (this.cut) return null;

      // 执行
      this.$emit('action', e);

      if (this.async) return null;

      // toast('验证码已发送,请注意查收');
      // 计算
      this.cut = this.time;
      this.cutdown();
    },

    cutdown: function () {
      if (this.cut <= 0) return clearTimeout(this.timer)
      this.timer = setTimeout(function () {
        this.cut -= 1;
        this.cutdown();
      }.bind(this), 1000);
    }
  },

  beforeDestroy: function () {
    clearTimeout(this.timer);
  }
}
</script>
