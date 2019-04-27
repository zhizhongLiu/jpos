<template>
  <dd-page title="消息详情">
    <div class="title-info">
      <text class="title-txt">{{messageDetail.title}}</text>
      <!-- <text class="time-txt">{{new Date(messageDetail.time).toLocaleString()}}</text> -->
      <text class="time-txt">{{new Date(messageDetail.time).getFullYear()}}-{{new Date(messageDetail.time).getMonth()+1}}-{{new Date(messageDetail.time).getDate()}} {{new Date(messageDetail.time).getHours()}}:{{new Date(messageDetail.time).getMinutes()}}:{{new Date(messageDetail.time).getSeconds()}}</text>

    </div>
    <div class="line">

    </div>
    <!-- <scroller class="message-info">
      <text class="message-content">{{messageDetail.messagecontent}}</text>
    </scroller> -->
    <div class="message-info">
      <textarea class="message-content"  disabled="true">{{messageDetail.description}}</textarea>
    </div>

  </dd-page>
</template>

<style>
  .title-info{
    width: 750;
    height: 140;
    padding-left: 30px;
    border-top-width: 2px;
    border-top-style: solid;
    border-top-color: #DDDDDD;
  }
  .title-txt{
    margin-top: 25;
    font-size:38;
    color:#000000;
  }
  .time-txt{
    margin-top: 25;
    font-size:28;
    color:#9b9b9b;
  }
  .line{
    margin-left: 30;
    margin-right: 30;
    border-bottom-width: 2px;
    border-bottom-style: dashed;
    border-bottom-color: #9b9b9b;
  }
  .message-info{
    width: 750;
    justify-content:flex-start;
    overflow: hidden;
    /*background-color: red;*/
    position: fixed;
    bottom: 20;
    top: 260;
    align-items:center;
  }
  .message-content{
    margin-top: 40;
    margin-left: 30;
    margin-right: 25;
    width: 700;
    height: 1000;
    font-size:28;
    justify-content:flex-start;
    color:#9b9b9b;
    text-overflow:inherit;
    position: fixed;
    top: 260;
    bottom: 40;
    overflow: hidden;
  }
</style>
<script>
  // import auth     from 'helpers/auth';
  // import request  from 'helpers/request';
  // import toast    from 'helpers/toast';
  import router   from 'plugins/router';

  export default{
    components:{
      ddPage: require('dd-components/vue/dd-page.vue'),
    },
    data () {
      return  {
        messageDetail:{
          title : '',
          time : '',
          description : '',
        },
      }
    },
    created: function () {
      this.getMsgDetail();
    },

    methods: {
      getMsgDetail: function () {
        this.messageDetail = router.getParmas(this);
      //   var parmas = router.getParmas(this);
      //   var msg_id = parmas.msg_id;
      //   var self = this;
      //   auth.getToken().then(info => {
      //     var req = {
      //       token: info.token,
      //       uuid: uuid,
      //       msg_id: msg_id,
      //     };
      //     var options = {
      //       method: 'GET',
      //       body: req,
      //       loading: true
      //     };
      //     request('/v1/user/message_detail', options).then(result => {
      //       if (result.code != '0000') return toast(result.msg);
      //       self.messageDetail = result.Message;
      //     }).catch(err => toast(err));
      //   }).then(result => {
      //     if (result.code != '0000') throw result.msg;
      //     return auth.update(result.data);
      //   }).catch(err => toast(err));
      //
      },
    }
  }

</script>
