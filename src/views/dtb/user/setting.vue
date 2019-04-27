<template>
  <dd-page title="设置" :leftItemSrc="left_img"  :leftItemColor="leftItemColor">
    <div style="height:30;"></div>
    <c-item title="修改登录密码" note="" @onItemClick="reset"></c-item>
  </dd-page>
</template>
<script>
  import router from 'plugins/router';
  import modal from 'plugins/modal';
  import source from 'helpers/source';
  import auth from 'helpers/auth';

  export default{

    components: {
      ddPage: require('dd-components/vue/dd-page.vue'),
	    button: require('components/common/button.vue'),
      cItem: require('./components/c-item.vue'),
    },
    methods:{
	    reset () {
        router.push('dtb_user_reset_pwd');
      },
      secede () {
	      auth.logout().finally(() => {
		      router.pop();
	        modal.show('dtb_user_login')
	      });
      }
    },
    computed: {
      right_img () {
        return source('tkzh_3.png');
      }
    }
  }
</script>
<style>
	.top {
		margin-top: 100px;
	}
</style>
