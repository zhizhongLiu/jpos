<template>
  <dd-page title="客户详情">
    <list class="lists">
      <cell class="cell">
        <div class="cell-boder">
          <text class="textright">姓名</text>
          <text class="text">{{dataList.name | nameFilter}}</text>
        </div>
      </cell>
      <cell class="cell">
        <div class="cell-boder" @click="callphone(dataList.mobile)">
          <text class="textright">手机号码</text>
          <text class="text-phone">{{dataList.mobile | phoneFilter}}</text>
          <image class="phoneimage" :src="iconcontact"></image>
        </div>
      </cell>
      <cell class="cell">
        <div class="cell-boder">
          <text class="textright">身份证号</text>
          <text class="text">{{dataList.idCard}}</text>
        </div>
      </cell>
      <cell class="cell">
        <div class="cell-boder">
          <text class="textright">证件有效期</text>
          <text class="text">{{dataList.idCardTime}}</text>
        </div>
      </cell>
      <cell class="cell">
        <div class="cell-boder">
          <text class="textright">提款账户</text>
          <text class="text">{{dataList.cardNo}}</text>
        </div>
      </cell>
      <cell class="cell">
        <div class="cell-boder">
          <text class="textright">所在地区</text>
          <text class="text">{{dataList.address}}</text>
        </div>
      </cell>
      <cell class="cell">
        <div class="cell-boder">
          <text class="textright">详细地址</text>
          <text :class="['text' +(dataList.addressDetail?'':'gray')]">{{dataList.addressDetail?dataList.addressDetail:"---省-市-区-楼-室"}}</text>
        </div>
      </cell>
    </list>
    <div class="server">
      <text class="second">功能服务</text>
    </div>
    <!-- <list class="dataList">
      <cell class="typecell" v-for="(item ,key) in datalist" :key="key">
        <div class="type-boder" @click="open">
          <image class="icon" :src="smzh"></image>
          <text class="text">替你开通</text>
          <text class="text-last" v-if="item.">已开通</text>
        </div>
      </cell>
    </list> -->
    <div class="type-boder" @click="open">
      <image class="icon" :src="smzh"></image>
      <text class="text-server">替你开通</text>
      <text class="text-last" >{{dataList.open?"立即开通":"已开通"}}</text>
    </div>
    <!--<div class="type-boder" @click="guarantee">-->
      <!--<image  class="icon" :src="db"></image>-->
      <!--<text class="text-server">替你担保</text>-->
      <!--<text class="text-last" >{{dataList.guarantee?"立即担保":"已担保"}}</text>-->
    <!--</div>-->
    <!-- <div class="type-boder" @click="agent">
      <image  class="icon" :src="dl"></image>
      <text class="text-server">一键代理</text>
      <text class="text-last" >{{dataList.guarantee?"立即代理":"已代理"}}</text>
    </div> -->

  </dd-page>
</template>
<style>
  .server{
    height: 60px;
    align-items: left;
  }
  .second{
    text-align: left;
    justify-content: center;
    margin-top: 10px;
    margin-left: 20px;
  }
  .lists{
    width: 750px;
    height: 700px;
  }
  .cell{
    width: 750px;
    height: 100px;
    background-color: #ffffff;
    border-bottom-width: 1px;
    border-bottom-color: #e5e5e5;
  }
  .cell-boder{
    width: 750px;
    height: 100px;
    /*flex-direction: row;
    align-items: center;*/
  }
  .textright{
    text-align: left;
    padding-left: 10px;
    margin-top: 30px;
    font-size: 32px;
    /*color: #596d7a;*/
  }
  .type-boder{
    width: 750px;
    height: 100px;
    flex-direction: row;
    background-color: #ffffff;
    border-bottom-width: 1px;
    border-bottom-color: #e5e5e5;
  }
  .text {
    text-align: right;
    position: absolute;
    right: 10px;
    top: 30px;
    font-size: 32px;
    /*color: #596d7a;*/
  }
  .textgray {
    text-align: right;
    position: absolute;
    right: 10px;
    top: 30px;
    font-size: 32px;
    color: #596d7a;
  }
  .text-phone{
    width: 300px;
    text-align: right;
    position: absolute;
    right: 60px;
    top:30px;
    font-size: 32px;
  }
  .phoneimage {
    position: absolute;
    width: 40px;
    height: 40px;
    right: 10px;
    top:30px;
  }

  /*.textgray{
    color: gray;
    text-align: left;
  }*/
  .text-last{
    position: absolute;
    right: 20px;
    width: 200px;
    text-align: right;
    top: 35px;
    font-size: 32px;
  }
  .icon {
    width: 40px;
    height: 40px;
    margin-top: 30px;
    margin-left: 10px;
  }
  .text-server {
    text-align: left;
    margin-top: 35px;
    font-size: 32px;
    margin-left: 20px;
    width: 300px;
  }
</style>
<script>
  import source   from 'helpers/source';
  import auth     from 'helpers/auth';
  import request  from 'helpers/request';
  import toast    from 'helpers/toast';
  import router   from 'plugins/router';
  import system   from 'plugins/system';

  export default {
    components:{
      ddPage: require('dd-components/vue/dd-page.vue'),
    },
    computed:{
      smzh () {
        return source('smzh.png');
      },
      db () {
        return source('db.png');
      },
      dl () {
        return source('dl.png');
      },
      iconcontact () {
        return source('icon_contact.png');
        // return source('dl.png');
      }
    },
    data () {
      return {
        crmid:'',
        dataList:[],
      }
    },
    filters: {
      phoneFilter (value) {
          return value ? value.substring(0,3) + '****' + value.substring(7) : '';
      },
      nameFilter (value) {
        if(!value) return '';
        var str='';
        for( var i=0; i<value.length-1; i++){
          str+='*';
        }
        return value.substring(0,1)+str;
      }
    },
    mounted: function () {
      this.getcrmInfo();
    },
    methods : {
      open () {
        router.push('openforu_open');
      },
      guarantee () {
        router.push('assureforu_assure');
      },
      recruit () {
        // router.push('dtb_common_crmdetail',item);
      },
      callphone (phoneNo) {
        toast.confirm({
				  message: '是否联系该客户?'+ phoneNo,
				  okTitle: "确定",
				  cancelTitle: "取消"
			  },result => {
				  result === "确定" ? system.callTel(phoneNo) : null;
			  })
      },
      getcrmInfo () {
        var self = this;
        var parmas = router.getParmas(this);
        self.crmid = parmas.id;
        auth.getToken().then(info => {
          var req = {
            token : info.token,
            customer_id : self.crmid,
          };
          var options = {
            method: 'GET',
            body: req,
            loading: true,
          };
          request('/v1/user/customer_detail',options).then(result => {
            // toast(JSON.stringify(result)});

            if (result.code != '0000') return toast(result.msg);
            self.dataList = result.data;
          }).catch(err => toast(err));
        }).then(result => {
          if (result.code != '0000') throw result.msg;
          return auth.update(result.data);
        }).catch(error => {
          return toast(error);
        });

      }
    }
  }
</script>
