<template>
  <dd-page title="修改密码" titleColor="#5C707B">
    <div class="bg">
      <input type="tel" placeholder="请输入手机号码" class="phonenum" :value="user_phone" @input="onPhoneNum" maxlength="11"></input>
      <label placeholder="请输入验证码" :value="codeNum" @input="oncodeNum" random="true" :width="750">
        <div class="codebox">
          <code time="30" :check="user_phone" @action="getMobileMac" noradius="noradius" class="code" value="发送验证码"></code>
        </div>
      </label>
      <label type="password" placeholder="新密码" :value="new_pwd" @input="onnew_pwd" :random="true" :width="750"></label>
      <label type="password" placeholder="再输入一次密码" :value="again_pwd" @input="onagain_pwd" :random="true" :width="750"></label>
    </div>
    <btn text="立即重置" :disable="!(user_phone && codeNum && new_pwd && again_pwd)" @btnClick="handleSubmit"></btn>
  </dd-page>
</template>

<script>
import request from 'helpers/request';
import toast from 'helpers/toast';
import router from 'plugins/router';
import regx from 'helpers/regx';

export default {
  data() {
    return {
      user_phone: '',
      codeNum: '',
      new_pwd: '',
      again_pwd: ''
    }
  },
  components: {
    ddPage: require('dd-components/vue/dd-page.vue'),
    btn: require('components/common/button.vue'),
    code: require('components/common/code.vue'),
    label: require('../common/components/label.vue')
  },
  methods: {
    onPhoneNum(e) {
      this.user_phone = e.value;
    },
    oncodeNum(e) {
      this.codeNum = e.value;
    },
    onnew_pwd(e) {
      this.new_pwd = e.value;
    },
    onagain_pwd(e) {
      this.again_pwd = e.value;
    },
    getMobileMac() {
      if (!this.user_phone) return toast('请输入手机号!');
      if (!regx.isPhone(this.user_phone)) return toast("请输入正确的手机号!");

      var req = {
        mobile_phone: this.user_phone,
        code_type: '0'
      };
      var options = {
        method: 'GET',
        body: req,
        loading: true
      };
      request('/v1/public/send_verify_code', options).then(e => {
        if (e.code != '0000') return toast(e.msg);
        toast('发送验证码成功');
      }).catch(error => {
        return toast(error);
      });
    },

    handleSubmit() {
      if (!this.user_phone) {
        return toast('请输入手机号!');
      }else if (!regx.isPhone(this.user_phone)) {
        return toast("请输入正确的手机号!");
      }else if (!this.codeNum) {
        return toast("请输入验证码");
      }else if (!this.new_pwd) {
        return toast("请输入密码");
      }else if (!this.again_pwd) {
        return toast("请再次输入密码");
      }else if (this.new_pwd != this.again_pwd) {
        return toast('两次密码输入不一致');
      } else {
        // 提交
        var req = {
          user_name: this.user_phone,
          code_msg: this.codeNum,
          new_password: this.new_pwd
        };
        var options = {
          method: 'POST',
          body: req,
          loading: true
        };
        request('/v1/public/reset_password', options).then(e => {
          if (e.code != '0000') return toast(e.msg);
          toast('重置登录密码成功');
          return router.pop();
        }).catch(error => {
          return toast(error);
        });
      }
    }
  }
}
</script>

<style>

.phonenum {
  flex: 5;
  height: 100;
  margin-left: 30;
  text-align: left;
  padding-right: 20px;
  border-bottom-width: 1px;
  border-bottom-color: #e9e9e9;
}

.codebox {
  width: 200px;
  margin-right: 30px;
}

.code {
  width: 200px;
  height: 100px;
  justify-content: center;
  align-items: center;
}
.bg {
  background-color: #fff;
}
</style>
