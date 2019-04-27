<template>
    <wow-view
        :view_header_right_txt="computedRightTxt"
        :view_header_right_color="params.mbl ? '#5A5D62':'#F76B1C'"
        @rightItemClick="handleRight"
        :view_header_right_src="params.mbl && !params.type ? rightSrc: ''"
        view_header_center_txt="补充资质信息">
        <div class="prompt">
            <text class="prompt-text">温馨提示：AB类必填，其他选填</text>
        </div>
        <image-upload :image_arr="obj_image" :merc_mbl="obj_hidden.mercMbl.value"></image-upload>
        <wow-button
                button_margin_top="80"
                button_txt="下一步"
                @click="handleSubmit"
                :button_disabled="computedButton"
                class="button">
        </wow-button>
        <wow-button
                button_margin_top="40"
                button_txt="跳过"
                @click="handleJump(params, $event)"
                class="button">
        </wow-button>
        <!-- <div class="jump-button">
            <text class="jump-button-text" @click="handleJump(params)">跳过</text>
        </div> -->
    </wow-view>
</template>
<script>
    // import WowView                  from 'wow-weex/lib/wow-view'
    // import ImageUpload              from 'components/merchant/image-upload'
    // import WowButton                from 'wow-weex/lib/wow-button'
    import Router                   from 'plugins/router'
    import Source                   from 'utils/source.util'
    import DataUtil                 from 'utils/data.util'
    // import EntryUtil                from 'utils/entry.util'
    // import Store                    from 'utils/store'
    // import _                        from 'utils/lodash/lodash'
    // import Loading                  from 'plugins/loading'
    // import Dialogs                  from 'plugins/dialogs'
    import Toast                    from 'helpers/toast'
    import Supplement_aptitudeMixin            from 'mixins/merchant/supplement_aptitude.mixin'
    import RegMixin                 from 'mixins/merchant/reg.mixin'
    export default {
        mixins: [Supplement_aptitudeMixin, RegMixin],
        data () {
            return {
                rightSrc: Source('sp_xq2.png'),
            }
        },
        computed: {
            computedButton () {
                let type = true;
                let filter_options = DataUtil.filterData(this.obj_image);
                for(let key in filter_options) {
                    if (filter_options[key]) {
                        type = false;
                    }
                }
                return type;
            },
        },
        created () {
            // 获取参数
            this.fetchPageParams();
            // 获取详情中存储的数据
            this.fetchStoreData(this.StoreDataCall);
            // 获取详情存储的数据
            this.fetchStoreDerails(this.StoreDerailsCall);
        },
        methods: {

            StoreDataCall(result) {
                // let payments = this.obj_hidden.payments.value;
                // if (payments.indexOf('alipay') > -1 || payments.indexOf('wechat') > -1) {
                //     // console.log(33333);
                //     this.obj_image.busiLicenseImg.use_check[0].nonempty = true;
                //     this.obj_image.busiDoorImg.use_check[0].nonempty = true;
                // }
                // console.log(this.obj_image);
            },
            StoreDerailsCall(result) {
                // let payments = this.obj_hidden.payments.value;
                // if (payments.indexOf('alipay') > -1 || payments.indexOf('wechat') > -1) {
                //     this.obj_image.busiLicenseImg.use_check.nonempty = true;
                //     this.obj_image.busiDoorImg.use_check.nonempty = true;
                // }
                if (result.busiLicenseImg) {
                    this.obj_image.busiLicenseImg.disabled = true;
                }
            },

            // 获取存储数据
            // fetchStoreData () {
            //     if (!this.params.key) return null;
            //     Loading.show();
            //     EntryUtil.get(this.params.key).then(result => {
            //         DataUtil.assignmentData(result, this.obj_image);
            //         DataUtil.assignmentData(result, this.obj_hidden);
            //         // let payments = this.obj_hidden.payments.value;
            //         // if (payments.indexOf('alipay') > -1 || payments.indexOf('wechat') > -1) {
            //         //     // console.log(33333);
            //         //     this.obj_image.busiLicenseImg.use_check[0].nonempty = true;
            //         //     this.obj_image.busiDoorImg.use_check[0].nonempty = true;
            //         // }
            //         // console.log(this.obj_image);
            //     }).catch(() => {
            //         Toast('没有找到对应的值');
            //     }).finally(() => {
            //         Loading.hide();
            //     });
            // },

            // 获取详情存储数据
            // fetchStoreDerails() {
            //     if (!this.params.mbl) return null;
            //     Loading.show();
            //     Store.get('merc_details').then((result) => {
            //         console.log('已提交--------详情数据', result);
            //         this.mer_view_remark = result.merViewRemark;
            //         DataUtil.assignmentData(result, this.obj_image);
            //         DataUtil.assignmentData(result, this.obj_hidden);
            //         // let payments = this.obj_hidden.payments.value;
            //         // if (payments.indexOf('alipay') > -1 || payments.indexOf('wechat') > -1) {
            //         //     this.obj_image.busiLicenseImg.use_check.nonempty = true;
            //         //     this.obj_image.busiDoorImg.use_check.nonempty = true;
            //         // }
            //         if (result.busiLicenseImg) {
            //             this.obj_image.busiLicenseImg.disabled = true;
            //         }
            //     }).catch((err) => {
            //         Toast('没有找到对应的值');
            //     }).finally(() => {
            //         Loading.hide();
            //     });
            // },

            

            // 跳转页面
            handleJump (data, callback) {
                // console.log(data);
                // console.log(callback);
                // if (DataUtil.checkData(this.obj_image)) return;
                Router.push('common_merchant_settlement_info', data);
                callback && callback();
            },

            // 保存数据
            // saveData (type = true) {
            //     return new Promise ((resolve, reject) => {
            //         Loading.show();
            //         let data = DataUtil.filterData({
            //             ...this.obj_image
            //         });
            //         data.key = this.params.key;
            //         EntryUtil.save(data).then((result) => {
            //             this.params.key = result.key;
            //             type && Toast('保存成功');
            //             resolve();
            //         }).catch(() => {
            //             type && Toast('保存失败');
            //             reject();
            //         }).finally(() => {
            //             Loading.hide();
            //         });
            //     })
            // },

            // 重新提交保存
            // saveDetail() {
            //     return new Promise((resolve, reject) => {
            //         Loading.show();
            //         let data = DataUtil.filterData({
            //             ...this.obj_image
            //         });
            //         Store.get('merc_details').then(res => {
            //             res = _.isObject(res) ? res : {};
            //             data = Object.assign(res, data);
            //             Store.set('merc_details', data).then(() => {
            //                 resolve();
            //             }).catch(() => {
            //                 reject('存储失败');
            //             })
            //         });
            //     })
            // },

            // 提交数据
            handleSubmit (callback) {
                if (DataUtil.checkData(this.obj_image)) return callback && callback();
                if (this.params.mbl) {
                    this.saveDetail().then(() => {
                        this.handleJump(this.params);
                        callback && callback();
                    }).catch(() => {
                        this.handleJump(this.params);
                    }).finally(() => {
                        callback && callback();
                    });
                } else {
                    this.saveData(false).then(() => {
                        this.handleJump(this.params);
                    }).catch(() => {
                        Toast('保存失败');
                        this.handleJump(this.params);
                    }).finally(() => {
                        callback && callback();
                    });
                }
            },

        },
        components: {
            // WowView,
            // ImageUpload,
            // WowButton,
        }
    }
</script>
<style>
    .button{
        margin-left: 30px;
    }
    .jump-button{
        margin-top: 20px;
        height: 100px;
        justify-content: center;
        align-items: center;
        margin-left: 30px;
        margin-right: 30px;
        margin-bottom: 80px;
    }
    .jump-button-text{
        font-size: 36px;
        color: #999;
    }
    .prompt{
        margin-top: 18px;
        height: 34px;
        align-items: center;
        flex-direction: row;
        padding-left: 32px;
    }
    .prompt-text{
        font-size: 24px;
        color: #949494;
    }
</style>
