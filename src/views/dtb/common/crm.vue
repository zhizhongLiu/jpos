<template>
  <dd-page :title="title" :rightItemSrc="sxgary" @rightItemClick="searchClick">
    <!-- 筛选框 -->
    <div ref="present" class="present-container" v-if="show_present_view" @click="presentDefault">
      <list class="options" ref="optionlist">
        <cell class="cell-type" v-for="(item, key) in status" :key="key">
          <div class="cell-type-panel" @click="onItemClick(item)">
            <image class="icon-curr" :src="item.url"></image>
            <text :class="['name' , item.id==statusId?'current':'']">{{item.name}}</text>
            <image class="icon-curr-flag" :src="flagSrc" v-if="item.id ==statusId"></image>
          </div>
        </cell>
      </list>
    </div>
    <!-- 搜索 -->
    <div class="container">
      <div class="label">
        <image class="icon" :src="search_img"></image>
        <ddsecrityinput
          class="input"
          type="text"
          placeholder="请输入客户手机号、姓名"
          placeholdercolor="#4A4A4A"
          :value="name_phone"
          autofocus="false"
          @input="onNamePhone"
          clearmode="whileedit"
        ></ddsecrityinput>
      </div>
      <div class="search-box" @click="searchkeyword">
        <text class="txt-name">搜索</text>
      </div>
    </div>
    <!-- 客户列表 -->
    <list class="list">
      <refresh class="refresh-view" :display="refresh_display ? 'show' : 'hide'" @refresh="onrefresh">
        <loading-indicator class="indicator"></loading-indicator>
        <text class="txt-name" v-if="refresh_display"> ⬇︎ 刷新中 </text>
      </refresh>
      <cell class="cell" v-for="(item,key) in crmlist" :key="key">
        <div class="cell-panel" @click="selectCell(item)">
          <image class="photo-image" :src="item.photoUrl?item.photoUrl:default_img"></image>
          <div class="middle-border">
            <text class="txt-name">{{item.name | nameFilter}} </text>
            <div class="image-boder">
              <image class="icon-type" :src="dl" v-if="item.recruit"></image>
              <image class="icon-type" :src="smzh" v-if="item.open"></image>
              <image class="icon-type" :src="db" v-if="item.guarantee"></image>
            </div>
          </div>
          <div class="type">
            <text class="txt-time">{{new Date(item.updateTime).getFullYear()}}-{{new Date(item.updateTime).getMonth()+1}}-{{new Date(item.updateTime).getDate()}} {{new Date(item.updateTime).getHours()}}:{{new Date(item.updateTime).getMinutes()}}:{{new Date(item.updateTime).getSeconds()}}</text>

            <!-- <text class="txt-time">{{new Date(item.updateTime).toLocaleString()}}</text> -->
            <!-- <text class="txt-time" :style="{ color: pricingColor(item.pricingStatus) }">{{pricingStatus(item.pricingStatus)}}</text> -->
          </div>
        </div>
      </cell>
      <cell>
        <div class="no-data" v-if="!crmlist || crmlist.length==0">
          <text class="txt-name nodata-txt">暂无数据</text>
        </div>
      </cell>
      <loading class="loading-view" :display="loading_display ? 'show' : 'hide'" @loading="onloading">
        <text class="txt-name" v-if="loading_display"> ⬆︎ 加载中... </text>
        <loading-indicator class="indicator"></loading-indicator>
      </loading>
    </list>
  </dd-page>
</template>
<style>
  /*.dropdown{
    justify-content: center;
    align-content: stretch;
    position: relative;
    z-index: 100;
  }
  .wrapper{
    justify-content:flex-start;
    flex-direction: column;
    position: relative;
  }*/
  .list{
    width: 750px;
  }
  .options {
    position: absolute;
    /*top: -181;*/
    top:155px;
    right: 0;
    width: 300;
    height: 320px;
    background-color: #ffffff;
    transform-origin: center center;
  }
  .present-container{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.1);
    flex-direction: column;
    justify-content: center;
    align-items: center
  }
  .image-container {
    margin-top: 64;
    width: 630;
    /*padding-left: 60;
    padding-right: 60;*/
    align-items: center;
    background-color: #ffffff;
    border-radius: 10;
  }
  /*.cell{
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 300;
    height: 90;
    padding-left:10;
    padding-right:30;

    border-bottom-width: 1;
    border-style: solid;
    border-color: #ddd;
  }
  .cell-panel {
    height: 90px;
    width: 300px;
    flex-direction: row;
    align-items:flex-start;
    justify-content:flex-start;
  }*/
  .cell-type{
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 300;
    height: 80;
    padding-right:30;
    padding-left: 10;

    border-bottom-width: 1;
    border-style: solid;
    border-color: #ddd;
  }
  .cell-type-panel {
    height: 80px;
    width: 300px;
    flex-direction: row;
    align-items:flex-start;
    justify-content:flex-start;
    /*background-color: yellow;*/
  }
  .cell-panel:active {
    background-color: #e5e5e5;
  }
  .container {
    background-color: #f5f5f9;
    width: 750px;
    flex-direction: row;
    height: 100px;
    align-items: center;
    padding-top: 12px;
  }
  .label {
    flex-direction: row;
    height: 80px;
    align-items: center;
    background-color: white;
    margin-left: 30px;
    width: 600px;
    border-radius: 40px;
    position: relative;
  }
  .icon {
    width: 35px;
    height: 35px;
    margin-left: 25px;
  }
  .input {
    width: 520px;
    height: 50px;
    margin-left: 20px;
    font-size: 28px;
  }
  .search-box {
    flex-direction: row;
    align-items: flex-end;
    padding: 20px;
  }
  .name {
    color: #333;
    font-size: 33;
    /*flex: 1;*/
    margin-left: 10px;
    /*background-color: red;*/
    margin-top: 25px;
  }
  .icon-curr{
    width: 45;
    height: 45;
    /*position: absolute;
    top: -5px;
    left: 5px;*/
    /*margin-left: 10px;*/
    margin-top: 20px;

  }
  .icon-curr-flag{
    width: 45;
    height: 45;
    position: absolute;
    top: 20px;
    right: 35px;
  }
  .current {
    color: #0088FB;
  }
  .capture-btn {
    height: 100px;
    width: 500px;
    margin-top: 20px;
    margin-bottom: 20px;
    background-color: #0076FF;
    justify-content: center;
    align-items: center;
    border-radius: 50px;
  }

  .capture-btn:active {
    background-color: #006BE8;
  }
  .cell {
    height: 140px;
    width: 750px;
    background-color: #ffffff;
    border-bottom-width: 1px;
    border-bottom-color: #e5e5e5;
  }

  .cell-panel {
    height: 140px;
    width: 750px;
    flex-direction: row;
    align-items: center;
  }

  .cell-panel:active {
    background-color: #e5e5e5;
  }
  .photo-image{
    margin-left: 30px;
    width: 100px;
    height: 100px;
  }
  .middle-border{
    margin-left: 10px;
    flex-direction: column;
  }
  .txt-name {
    font-size: 32;
    color: #596d7a;
  }
  .txt-time {
    font-size: 28;
    color: #596d7a;
  }

  .no-data {
    height: 1106px;
    width: 750px;
    align-items: center;
  }

  .nodata-txt {
    margin-top: 150px;
  }
  .type{
    position: absolute;
    top: 40px;
    right: 30px;
  }
  .indicator {
    height: 60;
    width: 60;
    color: #889967;
  }
  .loading-view {
    width: 750px;
    height: 100;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .image-boder{
    flex-direction: row;
    margin-top: 20px;
  }
  .icon-type{
    margin-left: 10px;
    width: 32px;
    height: 32px;
  }
  .refresh-view{
    width: 750px;
    height: 100;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .txt-name{
    text-align: center;
    margin-top: 10px;
  }

  .status {   }

  .status-1 { color: #090; }
  .status-2 { color: #f00; }
</style>
<script>

  const animation = weex.requireModule('animation');

  import source   from 'helpers/source';
  import auth     from 'helpers/auth';
  import request  from 'helpers/request';
  import toast    from 'helpers/toast';
  import router   from 'plugins/router';


  export default {
    components:{
      ddPage: require('dd-components/vue/dd-page.vue'),
    },
    computed:{
      search_img(){
        return source('search.png');
      },
      default_img() {
        return source('sdmcopy.png');
      },
      flagSrc (){
        // return "https://gw.alicdn.com/tps/TB11a2lKFXXXXbVXpXXXXXXXXXX-32-32.png";
        return source('jscg_1.png')
      },
      sxgary () {
        return source('sxgary.png');
      },
      db () {
        return source('db.png');
      },
      dl () {
        return source ('dl.png');
      },
      smzh () {
        return source ('smzh.png');
      }


    },
    data () {
      return{
        show_present_view:false,
        loading_display:false,
        refresh_display: false,
        title: '客户管理',
        showDrop: true,
        statusId: 0,
        screenHeight: 0,
        list: [],
        keyword:'',
        status: [
          {id: '0', name: '全部',url:source('qbgary.png'),type: 'all'},
          {id: '1', name: '账户开通',url:source('zhktgary.png'),type: 'open'},
          {id: '2', name: '额度担保',url:source('dbgary.png'),type: 'guarantee'},
          {id: '3', name: '代理商',url:source('dlgary.png'),type: 'recruit'},
        ],
        pattern: '',
        crmlist: [],
        current_page: 1,
        page_size: 10,
        totle_page: 0,
      }
    },
    filters :{
      nameFilter (value) {
        if(!value) return '';
        var str='';
        for( var i=0; i<value.length-1; i++){
          str+='*';
        }
        return value.substring(0,1)+str;
      }
    },
    // 挂载完成【http】
    mounted: function () {
      // self.getAuth();
      this.onrefresh();
    },
    methods:{
      searchClick () {//筛选
        // this.showDrop = !this.showDrop;
        this.show_present_view = true;
        // this.anim('optionlist',{transform:'scale(0.8)'},'ease-in-out',500);

      },
      anim (elemt,styles,timingFunction,duration) {
        var self = this;
        return new Promise(function (resolve,reject) {
          animation.transition(self.$refs[elemt].ref,{
            styles: styles,
            timingFunction: timingFunction,
            duration: duration
          },function ($event) {
            resolve();
          });
        })
      },
      searchkeyword () { //搜索关键字
        this.onrefresh();
      },
      presentDefault: function () {
        var self = this;
        this.anim('optionlist',{height: '0'},'ease',400).then(function() {
          self.show_present_view = !self.show_present_view;
        });

      },
      recieveMessage (pramas) {
        toast(pramas.title);
      },
      onItemClick (item) {

        this.show_present_view = false;
        this.title = item.name;
        this.statusId = item.id;
        this.onrefresh();
      },
      onturetake () {
        this.show_present_view = false;
      },
      onNamePhone(e) {
        this.keyword = e.value;
      },
      onrefresh () {
        // dialogs.toast({message : 'dsd'});//加弹框无法显示刷新
        this.refresh().show();
        this.current_page = 1;
        this.pattern = 'REFRESH'; //刷新
        //请求新数据
        this.searchcrm();
      },

      onloading() {
        // dialogs.toast({message : 'dsd'});//加弹框无法显示刷新
        this.loading().show();
        this.current_page++;
        this.pattern = 'LOADING'; //加载
        //加载更多数据
        this.searchcrm();
      },
      refresh() {
        return {
          show: () => {
            this.refresh_display = true;
            setTimeout(() => this.refresh_display = false, 2000);
          }
        }
      },
      loading() {
        return {
          show: () => {
            this.loading_display = true;
            setTimeout(() => this.loading_display = false, 2000);
          }
        }
      },
      searchcrm () {
        var self = this;
        var index = this.statusId;
        var type = self.status[index].type;
        auth.getToken().then(info =>{
          var req = {
            token : info.token,
            current_page : self.current_page,
            page_size : self.page_size,
            type : type,
            key_word : self.keyword,
          };
          var options = {
            method: 'GET',
            body: req,
            loading: true,
          };
          // dialogs.toast({message : JSON.stringify(options)});
          request('/v1/user/customer_list',options).then(result =>{
            if (result.code != '0000') return toast(result.msg);
            // dialogs.toast({message : 'dsd' + JSON.stringify(result)});

            self.totle_page = result.data.pageInfo.totle_page;
            if (self.pattern === 'REFRESH') {
              self.crmlist = result.data.pageData;
            } else if (self.pattern === 'LOADING') {
              self.crmlist = [...self.crmlist,...result.data.pageData];
            }

          }).catch(err => toast(err));
        }).then(result => {
          if (result.code != '0000') throw result.msg;
          return auth.update(result.data);
        }).catch(err => toast(err));
      },
      selectCell (item) {
        router.push('dtb_common_crmdetail',item);
      }
    }
  }

</script>
