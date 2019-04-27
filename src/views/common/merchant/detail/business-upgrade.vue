<template>
    <scroller class="wrap">
        <wow-input-cell
            class="cell-item"
            v-for="(item, key) in obj_input"
            :input_value="item.value"
            :input_max_length="item.max_length"
            :input_placeholder="item.placeholder"
            :input_label_txt="item.label"
            :input_type="item.type"
            :input_disabled="is_disabled || item.disabled"
            :input_use="item.use_input !== false"
            :input_use_right="item.use_input_right !== false"
            :key="key"
            @input="handleInput(item, $event)">
        </wow-input-cell>
        <image-upload :image_arr="obj_image" :image_disabled="obj_params.updateStatus !== '2'" :merc_mbl="data.mercMbl"></image-upload>
        <wow-button
            @click="handleSubmit"
            class="button"
             :button_disabled="obj_params.updateStatus !== '2'"
            button_txt="提交">
        </wow-button>
    </scroller>
</template>
<script>
    import WowInputCell             from 'wow-weex/lib/wow-input-cell'
    import WowButton                from 'wow-weex/lib/wow-button'
    import source                   from 'utils/source.util'
    import ImageUpload              from 'components/merchant/image-upload'
    import DataUtil                 from 'utils/data.util'
    import Api                      from 'api/entry.api'
    import Toast                    from 'helpers/toast'
    import Auth                     from 'helpers/auth'

    export default{
        data () {
            return {
                is_disabled: true,
                value: '',
                src_delete: source('dtb_details_detele_icon.png'),
                obj_hidden: {
                    crpNo: {
                        value: ''
                    },
                    mercLevl: {
                        value: '1',
                    },
                },
                obj_input: {
                    busRegNo: {
                        value: '',
                        label: '商户营业执照号',
                        placeholder: '请输入营业执照号',
                        disabled: true,
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请输入商户营业执照号',
                            },
                        ],
                    },
                },
                obj_image: {
                    // 营业执照
                    busiLicenseImg: {
                        value: '',
                        label: '营业执照',
                        src: '',
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请选择营业执照',
                            }
                        ]
                    },
                    // 收银台照
                    cashDeskImg: {
                        value: '',
                        label: '收银台照',
                        src: '',
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请选择收银台照',
                            }
                        ]
                    },
                    // 经营场景照
                    busiPlaceImg: {
                        value: '',
                        label: '经营场景照',
                        src: '',
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请选择经营场景照',
                            }
                        ]
                    },
                    // 门头照
                    busiDoorImg: {
                        value: '',
                        label: '门头照',
                        src: '',
                        use_check: [
                            {
                                nonempty: true,
                                prompt: '请选择门头照',
                            }
                        ]
                    },
                }
            }
        },
        props: {
            data: { default: '' },
            obj_params: { default: '' },
        },
        methods: {
            // 初始化数据
            initData() {
                setTimeout(() => {
                    DataUtil.assignmentData(this.data, this.obj_input);
                    DataUtil.assignmentData(this.data, this.obj_hidden);
                    DataUtil.assignmentData(this.data, this.obj_image);
                }, 200);
            },
            // 赋值
            handleInput (item, event) {
                item.value = event.value;
            },

            // 下一步点击
            handleSubmit (callback) {
                let options = {
                    ...this.obj_input,
                    ...this.obj_hidden,
                    ...this.obj_image,
                };
                if (DataUtil.checkData(options)) return callback();

                // 过滤
                options = DataUtil.filterData(options);
                if (!DataUtil.checkDataChange(this.data, options)) {
                    return callback();
                }
                this.submitData(options, callback);

            },
            // 提交数据
            submitData(opt, callback) {
                Auth.getToken().then((info) => {
                    let options = {
                        method: 'POST',
                        body: {
                            token: info.token,
                            mercCode: this.obj_params.customerId,
                            agtMercId: (info.cpos && info.cpos.agentId) || (info.jfbpos && info.jfbpos.agentId) || '',   // 代理商ID可传可不传
                            uptType: '3',
                            productType: 'jfbpos',
                            ...opt,
                        },
                        loading: true
                    };
                    Api.updateMerchantInfo(options).then((result) => {
                        let { code, msg } = result;
                        if (code !== '0000') throw msg;
                        Toast(msg);
                        callback();
                    }).catch(error => {
                        Toast(error);
                        callback();
                    });
                })
            },
        },
        components: {
            WowInputCell,
            WowButton,
            ImageUpload,
        }
    }
</script>
<style>
    .cell-item{
        background-color: #fff;
    }
    .button{
        margin-left: 30px;
        margin-bottom: 80px;
    }
</style>
