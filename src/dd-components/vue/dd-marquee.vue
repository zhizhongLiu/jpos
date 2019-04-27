<template>
  <div
    class="wrap"
    @appear="appeared"
    @disappear="disappeared">
    <div
      ref="anim"
      class="anim">
      <slot></slot>
    </div>
  </div>
</template>

<style>
  .wrap {
    overflow: hidden;
    position: relative;
  }
  .anim {
    flex-direction: row;
    position: absolute;
    transform: translateX(0) translateZ(0);
  }
</style>

<script>
  const animation = weex.requireModule('animation')

  export default {
    props: {
      step: { default: 0 },
      count: { default: 0 },
      index: { default: 1 },
      duration: { default: 0 },
      interval: { default: 0 },
      outofview: { default: false }
    },

    methods: {
      run: function () {
        if (this.outofview) {
          setTimeout(this.run.bind(this), this.interval)
        } else {
          setTimeout(function () {
            this.animation(this.run.bind(this))
          }.bind(this), this.interval)
        }
      },
      animation: function (cb) {
        var offset = -this.step * this.index;
        animation.transition(this.$refs.anim.ref, {
          styles: {
            transform: 'translateX(' + offset + 'px) translateZ(0)'
          },
          timingFunction: 'ease',
          duration: offset ? this.duration : '300'
        }, function () {
          this.index = (this.index + 1) % (this.count);
          this.$emit('change', {
            index: this.index,
            count: this.count
          });
          cb && cb();
        }.bind(this));
      },

      appeared: function() {
        this.outofview = false
      },

      disappeared: function() {
        this.outofview = true
      }
    },

    created: function () {
      if (this.interval > 0 && this.step > 0 && this.duration > 0) {
        this.run()
      }
    },
  }
</script>
