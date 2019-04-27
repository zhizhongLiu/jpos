<template>
  <dd-page title="反馈建议" :leftItemSrc="left_img" >
    <div id="app">
      <div class="suggest_item">
        <textarea :value="content"
                  placeholder="请详细描述你的问题和建议，我们将及时更进解决。"
                  autofocus="true" @input="onContent" maxlength="200" rows="10" class="input"></textarea>
        <div class="note">
	        <text class="suggest_text">{{num}}字</text>
        </div>
      </div>
    </div>
    <btn text="提交" :disable="!content" @btnClick="btnClick"></btn>
  </dd-page>
</template>
<style>
  .suggest_item{
	  padding: 20px;
	  flex-direction: column;
    background-color: white;
    margin-top: 40px;
  }
  .note {
	  flex-direction: row;
	  justify-content: flex-end;
  }
  .suggest_text {
	  font-size: 28px;
  }
	.input {
		padding: 10px;
		font-size: 28px;
	}
</style>
<script>
import auth    from 'helpers/auth';
import jf      from 'helpers/jfservice';
import router from 'plugins/router';
import dialogs from 'plugins/dialogs';
import request from 'helpers/request';

export default{
  components: {
	  ddPage: require('dd-components/vue/dd-page.vue'),
	  btn: require('components/common/button.vue'),
  },
  data () {
    return {
      content: '',
      num: 300
    }
  },
  methods: {
    respect () {
      router.push('dtb_user_respect');
    },
    onContent (event) {
      this.content = event.value;
      this.num = 300 - this.content.length;
    },
    btnClick () {
	    auth.getToken().then(info => {
		    jf.getUUID(info.phoneNo).then(uuid => {
			    var req = {
				    token: info.token,
				    uuid: uuid,
				    content: this.content
			    };
			    var options = {
				    method: 'post',
				    body: req,
				    loading: true
			    };
			    request('/v1/user/suggestions',options).then(result => {
				    if (result.code != '0000') return dialogs.toast({ message: result.msg });
				    dialogs.toast({ message: result.msg });
				    router.pop();
			    }).catch(error => {
				    return dialogs.toast({ message: error });
			    })
		    });
	    });
    }
  }
}
</script>
