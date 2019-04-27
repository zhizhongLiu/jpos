<template>
  <dd-page title="消息中心" >
    <div class="title-list" >
      <div  class="title-cell" @click="clicktitle(key)" v-for="(msgitem, key) in messageLists" :key="key">
        <text class="txtyellow" v-if="showkey==key" >{{msgitem.title}}</text>
        <text class="txt" v-if="showkey!==key">{{msgitem.title}}</text>
      </div>
    </div>
    <div >
      <div :style="{ width:130,height: 6, backgroundColor: backgroundColor ,left:progress}">
      </div>
    </div>
    <slider class="slider" @change="onchange" @scroll="onscroll" :index="index" >
      <list class="message-list"  v-for="(msgitem, key) in messageLists" :key="key">
        <refresh class="refresh-view" :display="msgitem.refresh_display ? 'show' : 'hide'" @refresh="onrefresh(index)">
          <loading-indicator class="indicator"></loading-indicator>
          <text class="txt-name" v-if="msgitem.refresh_display"> ⬇︎ 刷新中 </text>
        </refresh>
        <cell class="row" ref="row" v-for="(item, key) in msgitem.list" :key="key" >
          <div class="panel"  @click="pushdetail(item,key)">
            <!-- <div class="left">
              <div class="title">
                <text class="time-txt">{{new Date(item.time).toLocaleString()}}</text> -->
                <!-- <div class="readdiv"  v-if="!item.read">
                  <text class="time-txt2" >new</text>
                </div> -->
              <!-- </div>
              <text class="message-txt">{{item.title}}</text>
            </div>
            <image class="arrow-right" :src="right_image"></image> -->
            <div class="title">
              <text class="message-txt">{{item.title}}</text>
              <text class="message-txt2">{{item.description}}</text>
            </div>
            <text class="time-txt">{{new Date(item.time).getFullYear()}}-{{new Date(item.time).getMonth()+1}}-{{new Date(item.time).getDate()}} {{new Date(item.time).getHours()}}:{{new Date(item.time).getMinutes()}}:{{new Date(item.time).getSeconds()}}</text>
            <image class="arrow-right" :src="right_image"></image>
          </div>
        </cell>
        <cell>
          <div class="no-data" v-if="!msgitem.list || msgitem.list.length==0">
            <text class="txt-name nodata-txt">暂无数据</text>
          </div>
        </cell>
        <!-- <div>
          <image v-if="!msgitem.list.length" ></image>
        </div> -->
        <loading class="loading-view" :display="msgitem.loading_display ? 'show' : 'hide'" @loading="onloading(index)">
          <text class="txt-name" v-if="msgitem.loading_display"> ⬆︎ 加载中... </text>
          <loading-indicator class="indicator"></loading-indicator>
        </loading>
      </list>
    </slider>
  </dd-page>
</template>
<style>
  .refresh-view{
    justify-content: center;
    width: 750px;
  }
  .loading-view{
    justify-content: center;
    width: 750px;
    position: absolute;
    bottom: 20px;
  }
  .txt-name{
    text-align: center;
  }
  .title-list{
    width: 750px;
    height: 100px;
    background-color: white;
    flex-direction: row;
    justify-content:space-around;
    align-items: center;
    border-width: 2px;
    border-style: solid;
    border-color: #e5e5e5;
  }
  .title-cell{
    height: 80px;
    width: 150px;
  }
  .txtyellow{
    margin-top: 20px;
    color: #f2ae5a;
    text-align: center;
    font-size: 38px;
  }
  .txt{
    margin-top: 20px;
    text-align: center;
    font-size: 38px;
  }
  .slider {
    /*margin-top: 0px;
    width: 750px;*/
    position: fixed;
    top: 260;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .message-list{
    width: 750px;
    /*height: 700px;*/

  }
  .row{
    width: 750;
    height: 140;
    background-color: white;
    /*padding-left: 30px;*/
    border-bottom-width: 2px;
    border-bottom-style: solid;
    border-bottom-color: #DDDDDD;
  }
  .panel:active{
    background-color: #f2f2f2;
  }
  .panel {
    height: 140px;
    width: 750px;
    flex-direction: row;
    align-items: flex-start;
    padding-left: 30px;
    background-color: #ffffff;
    border-bottom-width: 2px;
    border-bottom-style: solid;
    border-bottom-color: #DDDDDD;
  }
  .left{
    flex-direction: column;
    align-items: left;
  }
  .title {
    /*margin-top: 30px;
    flex-direction: row;
    align-items: center;*/

    margin-top: 10px;
    flex-direction: column;
    align-items: center;
  }
  .time-txt{
    font-size:28;
    color:#9b9b9b;

    position: absolute;
    top: 30px;
    right: 45px;
  }
  .time-txt2{
    font-size: 18px;
    color: #b81b2b;
    margin-bottom: 4px;
  }
  .readdiv{
    margin-left: 10px;
    margin-top: 4px;
    width: 54px;
    height: 20px;
    border-radius: 1000px;
    border-width: 2px;
    border-color: #b81b2b;
    align-items: center;
    justify-content: center;
  }
  .message-txt{
    margin-top: 20;
    font-size:32;
    width: 300px;
    text-align: left;
    color:#000000;
  }
  .message-txt2{
    margin-top: 20;
    font-size:28;
    width: 300px;
    text-align: left;
    color:#9b9b9b;
  }

  .arrow-right {
    width: 26;
    height: 26;
    position: absolute;
    top: 60px;
    right: 10px;
  }
  .txt-name {
    font-size: 30;
    color: #596d7a;
  }
  .no-data {
    /*height: 1106px;*/
    width: 750px;
    align-items: center;
  }

  .nodata-txt {
    margin-top: 150px;
  }
</style>
<script>
  import source   from 'helpers/source';
  import auth     from 'helpers/auth';
  import request  from 'helpers/request';
  import toast    from 'helpers/toast';
  import router   from 'plugins/router';
  import jf       from 'helpers/jfservice';
  // const dom = weex.requireModule('dom');

  export default {
    components: {
      ddPage: require('dd-components/vue/dd-page.vue'),
    },
    computed: {
      right_image: function () {
        return source('tkzh_3.png');
      }
    },
    props: {
      movewidth: { default: 233 },
      moveheight: { default: 10 },
      backgroundColor: { default: '#f2ae5a' },
    },
    data() {
      return {
        index: 0,
        totle_pagelist: [0,0,0],
        showkey: 0,
        pattern_list: ['REFRESH','REFRESH','REFRESH'],
        page_size: [10,10,10],
        current_page: [1,1,1],
        typelist: ['all','event','system'],
        loadList: ['load','load','load'],
        height:700,
        messageLists:[
          {
            list:[],
            title: '全部',
            loading_display:false,
            refresh_display: false,
          },
          {
            list:[],
            title: '活动',
            refresh_display: false,
            loading_display: false,
          },
          {
            list:[],
            title: '系统',
            refresh_display: false,
            loading_display: false,
          }
        ],
        progress: 60,
      }
    },
    mounted() {
      this.changekey(0);
      // var self = this;
      // dom.getComponentRect("container", function (option) {
      //     self.height = option.size.height - 1;
      //     toast(height);
      // });
      // setTimeout(function() {
      //   const result=dom.getComponentRect("row", function (option) {
      //     // self.height = option.size.height - 1;
      //     // toast(height + '32');
      //     toast(JSON.stringify(option))
      //   });
      // }, 100);
    },
    methods: {
      clicktitle (key) {   //点击title切换
        var index = key;
        this.progress = index * 250 + 60;
        this.changekey(index);
      },
      onchange (e) {     //slider滑动切换
        var index = e.index;
        this.progress = index * 250 + 60;
        this.changekey(index);
      },
      onscroll(e){      //slider滑动过程中
        var ratio = parseFloat(e.offsetXRatio);
        this.progress = 250 * this.index + (250 * -ratio) + 60;
      },
      changekey (key) {  //已经切换title
        var index = key;
        this.showkey = index;
        this.index = index;

        var isload = this.loadList[index];
        // dialogs.toast{message: isload};
        if (isload === 'load') {  //只第一次加载 防止每次切换加载
          this.getMessage(index);
          this.loadList[index] = 'noload';
          this.refresh(index).show(index);
        }
      },
      onrefresh(key) {
        var index = key;
        this.refresh(index).show(index);
        this.current_page[index] = 1;
        this.pattern_list[index] = 'REFRESH'; //刷新

        //请求新数据
        this.getMessage(index);

      },

      onloading(key) {
        var index = key;
        // this.loading().show();
        var page = this.current_page[index];
        this.current_page[index] = page++;
        this.pattern_list[index] = 'LOADING'; //加载

        //加载更多数据
        this.getMessage(index);
      },

      refresh(index) {
        return {
          show: (index) => {
            this.messageLists[index].refresh_display = true;
            setTimeout(() => this.messageLists[index].refresh_display = false, 2000);
          }
        }
      },
      pushdetail(item,key){  //是否已读
        // var self = this;
        // var msg_id = item.msg_id;
        // auth.getToken().then(info=>{
        //   var req = {
        //     token: info.token,
        //     msg_id : msg_id,
        //   };
        //   var options = {
        //     method: 'POST',
        //     body: req,
        //     loading: true
        //   };
        //   var messagelist = self.messageLists;
        //   var index = self.index;
        //   request('/user/read_message',options).then(result =>{
        //     toast(JSON.stringify(result) + '22' + result.code)
        //
        //     if (result.code != '0000') return toast(result.msg);
        //     toast(JSON.stringify(result))
        //     messagelist[index].read = true;
        router.push('mine_messagedetail',item);

        //   }).catch(error =>{
        //     return toast(error +'32');
        //   }).finally(function () {
        //     self.messageLists = messagelist;
        //   });
        // });
      },
      loading(index) {
        return {
          show: (index) => {
            this.messageLists[index].loading_display = true;
            setTimeout(() => this.messageLists[index].loading_display = false, 2000);
          }
        }
      },
      getMessage(index){
        var self = this;
        var currentpage = self.current_page[index];
        var pagesize = self.page_size[index];
        var msgtype = self.typelist[index];
        auth.getToken().then(info => {
          jf.getUUID(info.phoneNo).then(uuid => {
            var req = {
              token: info.token,
              uuid: uuid,
              msg_type: msgtype,
              current_page: currentpage,
              page_size: pagesize,
            };
            var options = {
              method: 'GET',
              body: req,
              loading: true
            };
            var messagelist = self.messageLists;
            request('/v1/user/message_list', options).then(result => {
              if (result.code != '0000') return toast(result.msg);
              // toast(JSON.stringify(result) + result.code);
              self.totle_pagelist[index] = result.data.pageInfo.totle_page;
              var pattern = self.pattern_list[index];
              if (pattern === 'REFRESH') {
                messagelist[index].list = result.data.pageData;
              }else if (pattern === 'LOADING') {
                messagelist[index].list = [...self.messagelist[index].list,...result.data.pageData];
              }
              // messagelist[index].list.forEach(function (item , keyindex) {
              //   var time = item.time;
              //   var year = time.getFullYear();
              //   var month = time.getMonth()+1;
              //   var date = time.getDate();
              //   var hour = time.getHours();
              //   var minuter = time.getMinutes();
              //   var second = time.getSeconds();
              //
              //   var newtime = year + '-' + month +'-' + date + ' ' + hour + ':' + minuter + ':' +second;
              //   messagelist[index].list[keyindex].time = newtime;
              // })
              // self.messageLists = messagelist;

            }).catch(error => {
              return toast(error);
            }).finally(function () {
              self.messageLists = messagelist;
            });
          }).catch(err => toast(err));
        }).then(result => {
          if (result.code != '0000') throw result.msg;
          return auth.update(result.data);
        }).catch(err => toast(err));
      }
    }
  }
</script>
