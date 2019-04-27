<template>
    <div class="image-wrap">
        <div class="image-item"
             v-for="(item, key) in image_arr"
             @click="handleClick(item)"
             :key="key"
             v-if="item.visible !== false">
            <image class="image-box" :src="handlePhoto(item)" autoBitmapRecycle="false" v-if="item.value"></image>
            <div class="image-box" v-if="!item.value">
                <image class="image" :src="src_default"></image>
                <text class="text">{{item.label}}</text>
            </div>
        </div>
    </div>
</template>
<script>
    import Source                   from 'utils/source.util'
    import Camera                   from 'plugins/camera'
    import Api                      from 'api/entry.api'
    import Auth                     from 'helpers/auth'
    import Toast                    from 'helpers/toast'
    import Picker                   from 'plugins/picker'
    import Config                   from 'config/env.config'

    const UPLOAD_IMG_URL = '/v1/pos/redo/download_file?imagePath=';
    export default {
        data () {
            return {
                src_default: Source('dtb_caramer_icon.png'),
            }
        },
        props:{
            image_size: {default: [338, 224]},
            image_arr: {default: []},
            image_disabled: {default: false,},
            merc_mbl: {default: '',},
        },
        methods: {

            // 图片处理
            handlePhoto (item) {
                let { src, value } = item;
                if (src) return src;
                if (value.indexOf(Config.API_URL) > -1) return value;
                return Config.API_URL + UPLOAD_IMG_URL + value;
            },

            // 拍摄照片
            handleClick (item) {
                if (this.image_disabled || item.disabled) return '';
                Picker.pick({ index: 0, items: ['相册', '拍照', '删除'] }).then(result => {
                    // result === 0 ? this.albumSelect(item) : this.takePhoto(item);
                    if (result === 0) {
                        this.albumSelect(item);
                    } else if(result === 1) {
                        this.takePhoto(item);
                    } else {
                        if (item.value) {
                            item.value = '';
                            Toast('删除成功');
                        }
                    }
                }).catch((error)=>{
                    Toast('取消');
                });
            },

            // 相册
            albumSelect (item) {
                Camera.pickCrop().then((result) => {
                    this.uploadImage(item, result.urlImage, result.image);
                }).catch(error => Toast(error));
            },

            // 拍照
            takePhoto (item) {
                Camera.crop({crop: false}).then((result) => {
                    this.uploadImage(item, result.urlImage, result.image);
                }).catch(error => Toast(error));
            },
            /**图片上传*/
            uploadImage (item, image_base64, image) {
                console.log('image_base64', image_base64);
                Auth.getToken().then(info => {
                    let options = {
                        method: 'POSTFILE',
                        body: {
                            file: image_base64,
                            req:{
                                file_type: 'jpeg',
                                need_thum: false,
                                token: info.token,
                                mobile: this.merc_mbl
                            }
                        },
                        loading: true,
                        http: true,    //上传图片走http
                    };
                    Api.uploadImage(options).then(result => {
                        let { code, msg } = result;
                        if (code === '0000') {
                            item.value = result.data.fileUrl;
                            item.src = image;
                        } else {
                            item.value = '';
                            item.src = '';
                        }
                        Toast(msg);
                    })
                });
            },
            downloadImage(item) {
                console.log(Config.API_URL + '/v1/pos/redo/download_file?imagePath=' + item.value);
                return Config.API_URL + '/v1/pos/redo/download_file?imagePath='+ item.value
            },
            forEach (obj, callback) {
                for(let key in obj){
                    callback && callback(obj[key], key);
                }
            },
        },
        created () {
            // this.downloadImage();
        }
    }
</script>
<style>
    .image-wrap{
        padding-left: 28px;
        padding-right: 28px;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: 32px;
    }
    .image-item{
        margin-bottom: 20px;
        align-items: center;
        background-color: #fff;
        border-radius: 16px;
        width: 338px;
        height: 224px;
    }
    .image-box{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        justify-content: center;
        align-items: center;
    }
    .image{
        width: 78px;
        height: 62px;
    }
    .text{
        margin-top: 35px;
        font-size: 30px;
        color: #888888;
    }
</style>
