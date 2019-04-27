<template>
    <wow-view
        :view_header_right_txt="computedRightTxt"
        :view_header_right_color="params.mbl ? '#5A5D62':'#F76B1C'"
        @rightItemClick="handleRight"
        :view_header_right_src="params.mbl && !params.type ? rightSrc: ''"
        view_header_center_txt="资质信息">
        <image-upload :image_arr="obj_image" :merc_mbl="obj_hidden.mercMbl.value"></image-upload>
        <wow-button
            button_margin_top="80"
            button_txt="下一步"
            @click="handleSubmit"
            :button_disabled="computedButton"
            class="button">
        </wow-button>
    </wow-view>
</template>
<script>
    import WowView                  from 'wow-weex/lib/wow-view'
    import ImageUpload              from 'components/merchant/image-upload'
    import WowButton                from 'wow-weex/lib/wow-button'
    import Router                   from 'plugins/router'
    import Source                   from 'utils/source.util'
    import DataUtil                 from 'utils/data.util'
    import EntryUtil                from 'utils/entry.util'
    import Store                    from 'utils/store'
    import _                        from 'utils/lodash/lodash'
    import Loading                  from 'plugins/loading'
    import Dialogs                  from 'plugins/dialogs'
    import Toast                    from 'helpers/toast'
    import AptitudeMixin            from 'mixins/merchant/aptitude.mixin'
    import RegMixin                 from 'mixins/merchant/reg.mixin'
    export default {
        mixins: [AptitudeMixin, RegMixin],
        data () {
            return {
                rightSrc: Source('sp_xq2.png'),
            }
        },
        created () {
            // 获取参数
            this.fetchPageParams();
            // 获取详情中存储的数据
            this.fetchStoreData(this.initData);
            // 获取详情存储的数据
            this.fetchStoreDerails(this.StoreDerailsCall);
        },
        methods: {
            initData (result) {
                let {
                    busRegNo
                } = result;
                if (busRegNo)
                    return null;
                this.obj_image.receiptProImg1.disabled = true;
                this.obj_image.receiptProImg2.disabled = true;
                this.obj_image.receiptProImg3.disabled = true;
            },
            // 获取存储数据
            // fetchStoreData () {
            //     if (!this.params.key) return null;
            //     Loading.show();
            //     EntryUtil.get(this.params.key).then(result => {
            //         DataUtil.assignmentData(result, this.obj_image);
            //         DataUtil.assignmentData(result, this.obj_hidden);
            //     }).catch(() => {
            //         Toast('没有找到对应的值');
            //     }).finally(() => {
            //         Loading.hide();
            //     });
            // },
            StoreDerailsCall(result) {
                this.initDiable();
                if (result.receiptProImg) {
                    let arr = result.receiptProImg.split('|');
                    this.obj_image.receiptProImg1.value = arr[0];
                    this.obj_image.receiptProImg1.disabled = true;
                    this.obj_image.receiptProImg2.value = arr[1];
                    this.obj_image.receiptProImg2.disabled = true;
                    this.obj_image.receiptProImg3.value = arr[2];
                    this.obj_image.receiptProImg3.disabled = true;
//                    this.obj_image.receiptProImg4.value = arr[3];
                }
            },
            // 获取详情存储数据
            // fetchStoreDerails() {
            //     if (!this.params.mbl) return null;
            //     Loading.show();
            //     Store.get('merc_details').then((result) => {
            //         console.log('已提交--------详情数据', result);
            //         this.mer_view_remark = result.merViewRemark;
            //         DataUtil.assignmentData(result, this.obj_image);
            //         DataUtil.assignmentData(result, this.obj_hidden);
            //         this.initDiable();
            //     }).catch((err) => {
            //         Toast('没有找到对应的值');
            //     }).finally(() => {
            //         Loading.hide();
            //     });
            // },
            initDiable() {
                (this.params.type && this.params.type === 'all') && (this.obj_image.crpHoldImg.disabled = true);
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
                if (DataUtil.checkData(this.obj_image)) return callback();
                let receiptProImg = '';
                this.forEach(this.obj_image, (item, key) => {
                    if (item.type === 'sum') {
                        console.log(item)
                        receiptProImg += item.value + '|';
                    }
                });
                this.obj_hidden.receiptProImg.value = receiptProImg.slice(0, -1);
                if (this.params.mbl) {
                    this.saveDetail().then(() => {
                        callback();
                        this.handleJump('common_merchant_supplement_aptitude_info', this.params);
                    }).catch(() => {
                        this.handleJump('common_merchant_supplement_aptitude_info', this.params);
                    }).finally(() => {
                        callback();
                    });
                } else {
                    this.saveData(false).then(() => {
                        this.handleJump('common_merchant_supplement_aptitude_info', this.params);
                    }).catch(() => {
                        Toast('保存失败');
                        this.handleJump('common_merchant_supplement_aptitude_info', this.params);
                    }).finally(() => {
                        callback();
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
</style>
