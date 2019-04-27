<template>
  <dd-page :title="getTitle">
    <div class="web-box">
      <web class="content" :src="linkSrc" @error="failload"></web>
    </div>
  </dd-page>
</template>

<style>
  .web-box {
    width: 750px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0px;
  }
</style>

<script>
  import router from 'plugins/router';
//  import toast from 'helpers/toast';

  export default {
    components: {
      ddPage: require('dd-components/vue/dd-page.vue'),
    },

    computed: {
      linkSrc() {
        var info = router.getParmas(this) || {};
        return info.link || '';
      },
      getTitle() {
        var info = router.getParmas(this) || {};
        return info.title || '帮助';
      },
    },

    methods: {
//      failload(error) {
//        toast(error + 'error');
//      }
    },

    created() {

    },
  };
</script>
