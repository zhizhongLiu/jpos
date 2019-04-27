<template>
  <dd-page title="账户设置">
    <div class="content" @click="photograph">
      <text class="txt">头像</text>
      <image :src="user_img ? user_img: default_img" class="user-img"></image>
    </div>
    <div class="content">
      <text class="txt">姓名</text>
      <text class="user-text">{{realname | filterName}}</text>
    </div>
    <div class="content">
      <text class="txt">性别</text>
      <text class="user-text">{{sex}}</text>
    </div>
    <div class="content">
      <text class="txt">手机号码</text>
      <text class="user-text">{{phonenum | phoneFilter}}</text>
    </div>

    <div class="content">
      <text class="txt">所在地区</text>
      <div class="area">
        <text class="txt" @click="addressClick">{{address}}</text>
        <image :src="location" class="location" @click="position"></image>
      </div>
    </div>

    <dtb-input itemHeight="120" borderBottomColor="transparent" borderTopColor="#e5e5e5" name="居住地址" :value="addressDetail" placeholder="请输入详细地址" @input="addressInput"
      leftTxtColor="#7F8A8C" rightTxtColor="#7F8A8C" leftFontSize="28" rightFontSize="28"></dtb-input>

    <!-- 上传照片弹出框 -->
    <div v-if="update_img" class="photograph" @click="test">
      <div class="dialog-content">
        <div class="txt-content" @click="camera">
          <text class="txt">拍摄照片</text>
        </div>
        <div class="txt-content1" @click="picture">
          <text class="txt">从相册选择</text>
        </div>
        <div class="txt-content2" @click="cancel">
          <text class="txt">取 消</text>
        </div>
      </div>
    </div>

    <btn v-if="user_img != old.olduser_img || address != old.oldaddress || addressDetail != old.oldaddressDetail" :disable="!addressDetail" text="立即提交" @btnClick="submit"></btn>
  </dd-page>
</template>

<script>
  import auth from 'helpers/auth';
  import source from 'helpers/source';
  import request from 'helpers/request';
  import toast from 'helpers/toast';
  import camera from 'plugins/camera';
  import picker from 'plugins/picker'; //三级联动城市
  import location from 'plugins/location';
  import router from 'plugins/router';
  import FilterMixin    from 'mixins/filter.mixin'
  import CityApi from 'api/extends/city.extend'

  export default {
      mixins: [FilterMixin],
    data() {
      return {
        token: '',
        user_img: '',
        realname: '',
        sex: '',
        phonenum: '',
        address: '',
        addressDetail: '',
        update_img: false,
        old: {
          olduser_img: '',
          oldaddress: '',
          oldaddressDetail: ''
        },
        img_url: ''
      }
    },
    filters: {
      phoneFilter (value) {
          return value ? value.substring(0,3) + '****' + value.substring(7) : '';
      }
    },
    computed: {
      location() {
        return source('location.png');
      },
      default_img() {
        return source('grzx_2.png');
      }
    },
    components: {
      ddPage: require('dd-components/vue/dd-page.vue'),
      btn: require('components/common/button.vue'),
    },
    methods: {
      getauth() {
        auth.getToken().then(result => {
          this.user_img = result.photoUrl;
          this.realname = result.realName;
          this.sex = result.sex === 'woman' ? '女' : '男';
          this.phonenum = result.phoneNo;
          this.address = result.address;
          this.addressDetail = result.addressDetail;
          this.token = result.token;
          this.old.olduser_img = result.photoUrl;
          this.old.oldaddress = result.address;
          this.old.oldaddressDetail = result.addressDetail;
        }).catch(() => {});
      },
      photograph() {
        this.update_img = !this.update_img;
      },
      test() {
        this.update_img = false; //取消照相弹出框
      },
      camera: function (e) {
        this.update_img = false; //取消照相弹出框
        var params = { //crop: false不裁剪  crop: true裁剪
          crop: true
        };
        camera.take(params).then(result => {
          this.user_img = result.image;
          this.fetch_upload(result.urlImage); //合影照
        }).catch(err => toast(err));
      },
      picture() {
        this.update_img = false; //取消照相弹出框
        var params = { //crop: false不裁剪  crop: true裁剪
          crop: true
        };
        camera.pick(params).then(result => {
          this.user_img = result.image;
          this.fetch_upload(result.urlImage); //合影照
        }).catch(err => toast(err));
      },
      cancel() {
        this.update_img = false; //取消照相弹出框
      },
      fetch_upload(newfile) {
        auth.getToken().then(info => {
          var req = {
            file: newfile,
            req: {
              file_type: 'jpeg',
              need_thum: false,
              token: info.token
            }
          };
          var options = {
            method: 'POSTFILE',
            body: req,
            loading: true,
            http: true, //上传图片走http
          };

          request('/v1/public/upload_file', options)
            .then(result => {
              if (result.code != '0000') return toast(result.msg);
              this.img_url = result.data.fileUrl;
              // toast(result.msg);
            })
            .catch(err => toast(err));
        });
      },
      addressClick() {
        CityApi.getCity().then(city => {
          picker.picks(city).then(result => {
            this.address = result[0].name + result[1].name + result[2].name;
          })
        })
      },
      addressInput(e) {
        this.addressDetail = e.value;
      },
      submit() {
        var options = {
          method: 'POST',
          loading: true,
          body: {
            token: this.token,
            photo_url: this.img_url,
            address: this.address,
            address_detail: this.addressDetail,
            sex: this.sex,
          }
        };
        request('/v1/user/updata_userinfo', options).then(result => {
          if (result.code != '0000') return toast(result.msg);
          toast(result.msg);
          router.pop();
        }).catch(err => toast(err));
      },
      position() { //定位
        location.get().then(result => {
          this.address = (result.locality ? result.locality : '') + (result.subLocality ? result.subLocality : '');
          this.addressDetail = (result.thoroughfare ? result.thoroughfare : '') + (result.subThoroughfare ? result.subThoroughfare :
            '');
        }).catch(err => toast(err));
      }
    },
    mounted() {
      this.getauth();
    }
  }
</script>

<style>
  .content {
    height: 120;
    padding: 30;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    border-top-width: 2;
    border-top-color: #e5e5e5;
  }

  .user-img {
    width: 100px;
    height: 100px;
    border-radius: 100px;
    margin-left: 40px;
  }

  .txt {
    font-size: 28;
    color: #7F8A8C;
  }

  .user-text {
    color: #949494;
    font-size: 28;
  }

  .location {
    width: 40px;
    height: 40px;
  }

  .area {
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    flex: 3;
  }


  .photograph {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
  }

  .dialog-content {
    height: 280;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    position: absolute;
    flex-direction: column;
    bottom: 0;
    right: 0;
    left: 0;
  }

  .txt-content {
    justify-content: center;
    align-items: center;
    height: 70px;
    width: 900;
    flex: 1;
    border-bottom-width: 1;
    border-bottom-color: #eee;
  }

  .txt-content1 {
    justify-content: center;
    align-items: center;
    height: 70px;
    width: 900;
    flex: 1;
    border-bottom-width: 1;
    border-bottom-color: #eee;
  }

  .txt-content2 {
    justify-content: center;
    align-items: center;
    height: 70px;
    width: 900;
    flex: 1;
    border-bottom-width: 1;
    border-bottom-color: #eee;
  }
</style>
