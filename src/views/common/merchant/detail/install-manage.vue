<template>
    <scroller>
        <div v-for="(data, index) in install_arr" :key="index">
            <wow-input-cell class="cell-item"
                v-for="(item, key) in data"
                :input_value="item.value"
                :input_placeholder="item.use_placeholder && '请输入SN号'"
                :input_label_txt="item.label"
                :input_disabled="item.disabled"
                :class="[item.is_margin && 'margin']"
                :key="key"
                @input="handleInput(item, $event)">
                <div slot="input_other"
                    class="input-edit"
                    v-if="item.disabled && item.use_slot">
                    <image class="edit-image" :src="src_edit" @click="handleEdit(item)"></image>
                    <text class="input-line"></text>
                    <image class="edit-image" :src="src_delete" @click="handleDelete(item.value)"></image>
                </div>
                <div slot="input_other"
                    class="input-unit"
                    v-if="!item.disabled && item.use_slot"
                    @click="handleBind(item.value, item)">
                    <text class="sure-text">确认</text>
                </div>
            </wow-input-cell>
        </div>
        <!--押金返还-->
        <div class="pop-wrap" @click="handleNull" v-if="is_return">
            <div class="buss-inner">
                <div class="buss-inner-txt">
                    <text class="pop-title">请选择押金返还对象</text>
                    <div class="radio-item" @click="handleRadio(item, key)" v-for="(item, key) in radio_arr.use_radio" :key="key">
                        <image class="radio-image" :src="radio_arr.value === item.value ? src_radio_checked : src_radio_normal"></image>
                        <text class="radio-text">{{item.text}}</text>
                    </div>
                </div>
                <div class="buss-sure-btn">
                    <text class="buss-channel-btn-text" @click="handleBussBtn('cancel')">取消</text>
                    <text class="buss-sure-btn-text" @click="handleBussBtn('bind')">确定</text>
                </div>
            </div>
        </div>
        <!--终端换机-->
        <div class="pop-wrap" @click="handleNull" v-if="is_change">
            <div class="change-inner">
                <text class="change-title">终端换机</text>
                <div class="change-option">
                    <text class="change-item" :style="{backgroundColor: item.checked ? '#F76B1C' : '#E8E8E8', color: item.checked ? '#fff' : '#373737'}" @click="handleSwitch(item, key)" v-for="(item, key) in change_arr" :key="key">{{item.text}}</text>
                </div>
                <text class="change-sn-title">换机终端SN号：</text>
                <input class="change-input" v-model="change_value"
                     :disabled="change_index !== '6'"
                     :style="{backgroundColor: change_index !== '6' ? '#ededed' : '#fff'}"
                     maxlength="9999"
                     placeholder="例：ND8634623721"
                     placeholder-color="#949494"/>
                <text class="tip-txt">如果该设备参加活动，换机会导致活动失效</text>
                <div class="buss-sure-btn">
                    <text class="buss-channel-btn-text" @click="is_change = !is_change">取消</text>
                    <text class="buss-sure-btn-text" @click="handleChange(item)">确定</text>
                </div>
            </div>
        </div>
        <wow-button @click="handleAdd"
            class="button"
            :button_disabled="obj_params.updateStatus !== '2'"
            button_txt="添加SN号">
        </wow-button>
    </scroller>
</template>
<script>
    import WowInputCell             from 'wow-weex/lib/wow-input-cell'
    import WowButton                from 'wow-weex/lib/wow-button'
    import Source                   from 'utils/source.util'
    import Toast                    from 'helpers/toast'
    import Api                      from 'api/entry.api'
    import Channel                  from 'plugins/channel'
    import Auth                     from 'helpers/auth'

    const $$RefreshDetail = '$$RefreshDetail';

    export default{
        data () {
            return {
                install_arr: [],
                radio_arr: {
                    value: '',
                    use_radio: [
                        {
                            text: '代理商',
                            value: '1',
                        },
                        {
                            text: '商家',
                            value: '2'
                        }
                    ],
                },
                change_arr: [
                    {
                        text: '返厂维修',
                        checked: true,
                        value: '4'
                    },{
                        text: '机器损坏',
                        checked: false,
                        value: '5'
                    },{
                        text: '仅换机',
                        checked: false,
                        value: '6'
                    },
                ],
                src_delete: Source('dtb_details_detele_icon.png'),
                src_edit: Source('sn_edit.png'),
                src_radio_checked: Source('dtb_radio01_checked.png'),
                src_radio_normal: Source('dtb_radio01_normal.png'),
                is_return: false,
                terminalItem: {},   // 查询到的sn活动信息
                change_value: '',   // 换机sn号
                is_change: false,   // 换机弹框
                change_index: '4',  // 换机类型
                sn_item: '',    // 换机当前sn信息
                bind_type: ''
            }
        },
        props: {
            obj_params: { default: ''},
            data: { default: '' },
        },
        methods: {
            // 初始化数据
            initData () {
                setTimeout(() => {
                    if (!this.data.bindSn) return;
                    // var arr = [];
                    this.install_arr = [];
                    this.data.bindSn.forEach((data, k) => {
                        var init = { snCode: { value: '', terminalNo: '', disabled: true, label: 'SN号', use_slot: true, is_margin: true }, terminalNo: { value: '', disabled: true, label: '终端号' } }
                        init.snCode.value = data.snCode;
                        init.snCode.terminalNo = data.terminalNo;
                        init.terminalNo.value = data.terminalNo;
                        // this.install_arr[k] = init;
                        // arr.push(init);
                        // this.install_arr = arr;
                        this.install_arr.push(init);
                    })
                },200)

            },
            // 换机
            handleChange() {
                if (!this.change_value && this.change_index === '6') return Toast('SN号不能为空');
                // 仅换机
                if (this.change_index === '6') {
                    this.bind_type = 'change';
                    this.is_change = false;
                    return this.fetchTerminalType(this.change_value);
                }
                this.is_change = false;
                this.changeSure();
            },
            // 绑定
            handleBind(value) {
                if (!value) {
                    return Toast('SN号不能为空');
                }
                this.bind_type = 'bind';
                this.fetchTerminalType(value);
            },
            // 获取终端类型
            fetchTerminalType(value) {
                Auth.getToken().then((info) => {
                    let options = {
                        method: 'POST',
                        body: {
                            token: info.token,
                            agtMercId: (info.cpos && info.cpos.agentId) || (info.jfbpos && info.jfbpos.agentId) || '',
                            mercCode: this.obj_params.customerId,
                            trmSn: value, // 终端序列号
                            trmVersion: 'V1.1.9', // 终端版本号
                            productType: 'jfbpos'
                        },
                        loading: true
                    };
                    Api.fetchTerminalType(options).then((result) => {
                        let { code, msg, data } = result;
                        if (code !== '0000') throw msg;
                        this.terminalItem = data;
                        this.terminalItem.terminalSn = value;
                        let {
                            activityId,  // 活动编号
                            isWhetherAct,   // 是否参加活动 0 不参加 1 参加 2 已终止
                            terminalType,   // 终端类型 1 定制机 2 自备机
                        } = data;
                        if (!activityId || isWhetherAct === '2')
                            return Toast.alert({
                                message: '该机具无活动',
                                okTitle: '我知道了'
                            }, result => {
                                this.bind_type === 'change' ? this.changeSure() : this.bindTerminal();
                            });
                        if (terminalType === '1')
                            return this.is_return = true;
                        if (activityId)
                            return Toast.confirm({
                                message: '是否参加活动？',
                                okTitle: '是',
                                cancelTitle: '否'
                            }, result => {
                                if (result === "是") {
                                    return this.is_return = true;
                                }
                                this.bind_type === 'change' ? this.changeSure() : this.bindTerminal();
                            });
                        return Toast.alert({
                            message: '该机具无活动',
                            okTitle: '我知道了'
                        }, result => {
                            this.bind_type === 'change' ? this.changeSure() : this.bindTerminal();
                        });
//
//                        // 有活动并非定制机
//                        if (data.activityId && data.terminalType === '2' &&  data.isWhetherAct) {
//                            return Toast.confirm({
//                                message: '是否参加活动？',
//                                okTitle: '是',
//                                cancelTitle: '否'
//                            }, result => {
//                                if (result === "是") {
//                                    return this.is_return = true;
//                                }
//                                this.bind_type === 'change' ? this.changeSure() : this.bindTerminal();
//                            });
//                        } else if( data.activityId  && data.terminalType === '1') {
//                            return this.is_return = true;
//                        }
//                        this.bind_type === 'change' ? this.changeSure() : this.bindTerminal();
                    }).catch(error => {
                        this.terminalItem = '';
                        this.change_value = '';
                        this.sn_item = '';
                        this.radio_arr.value = '';
                        Toast(error)
                    });
                })

            },
            // 选择押金返还对象
            handleBussBtn(type) {
                // 定制机必须选择押金返还
                if (!this.radio_arr.value && type === 'bind') {
                    Toast('请选择押金返还对象');
                } else if(type === 'cancel') {
                    this.is_return = false;
                    this.change_value = '';
                    this.sn_item = '';
                    this.radio_arr.value = '';
                } else {
                    this.is_return = false;
                    this.bind_type === 'change' ? this.changeSure() : this.bindTerminal();
                }



                // this.is_return = false;
                // this.bind_type === 'change' ? this.changeSure() : this.bindTerminal();
            },
            changeSure() {
                Auth.getToken().then((info) => {
                    let options = {
                        method: 'POST',
                        body: {
                            token: info.token,
                            terState: this.change_index,    // 换机类型
                            terminalSn: this.sn_item.value,
                            terminalSnNew: this.change_value,
                            salesmanPhone: (info.cpos && info.cpos.customerId) || (info.jfbpos && info.jfbpos.customerId) || '',    // 业务员手机号
                            isWhetherAct: this.radio_arr.value ? '1' : '0',    // 是否参加活动
                            actAttribution: this.radio_arr.value || '1',    // 活动归属
                        },
                        loading: true
                    };
                    Api.changeTerminal(options).then((result) => {
                        let { code, msg, data } = result;
                        if (code !== '000000') throw msg;
                        Channel.post($$RefreshDetail, {});
                        this.change_value = '';
                        this.sn_item = '';
                        this.handleSwitch({
                            text: '返厂维修',
                            checked: true,
                            value: '4'
                        }, 0);
                        this.radio_arr.value = '';
                        Toast('换机成功');
                    }).catch(error => {
                        Toast(error);
                        this.change_value = '';
                        this.sn_item = '';
                        this.radio_arr.value = '';
                    });
                });
            },
            // 绑定终端号
            bindTerminal (data={}) {
                data = {
                    ...this.terminalItem,
                    isWhetherAct: this.radio_arr.value ? '1' : '0',    // 是否参加活动
                    actAttribution: this.radio_arr.value || '1',    // 活动归属
                };
                Auth.getToken().then((info) => {
                    let options = {
                        method: 'POST',
                        body: {
                            token: info.token,
                            salesmanPhone: info.phoneNo,
                            agentId: (info.cpos && info.cpos.agentId) || (info.jfbpos && info.jfbpos.agentId) || '',
                            merchantNo: this.obj_params.customerId,
                            trmVersion: 'V1.1.9', // 终端版本号
                            productType: 'jfbpos',
                            ...data
                        },
                        loading: true
                    };
                    Api.bindTerminal(options).then((result) => {
                        let { code, msg } = result;
                        if (code !== '0000') throw msg;
                        Channel.post($$RefreshDetail, {});
                        Toast('添加成功');
                        item.disabled = true;
                        this.radio_arr.value = '';
                    }).catch(error => {
                        Toast(error);
                        this.radio_arr.value = '';
                    });
                });
            },
            // 删除，添加
            handleDelete (value) {
                Auth.getToken().then((info) => {
                    let options = {
                        method: 'POST',
                        body: {
                            token: info.token,
                            agtMercId: (info.cpos && info.cpos.agentId) || (info.jfbpos && info.jfbpos.agentId) || '',
                            mercCode: this.obj_params.customerId,
                            trmSn: value, // 终端序列号
                            trmVersion: 'V1.1.9', // 终端版本号
                            productType: 'jfbpos'
                        },
                        loading: true
                    };
                    Api.fetchTerminalType(options).then((result) => {
                        let { code, msg, data } = result;
                        if (code !== '0000') throw msg;
                        if (data.activityId) {
                            return Toast.confirm({
                                message: `该设备处于活动期间，解绑设备会导致活动失效，是否要继续解绑？`,
                                okTitle: '确认',
                                cancelTitle: '取消'
                            }, result => {
                                result === "确认" && this.unbindTerminal(value);
                            });
                        }
                        Toast.confirm({
                            message: `确认删除${value}？`,
                            okTitle: '确认',
                            cancelTitle: '取消'
                        }, result => {
                            result === "确认" && this.unbindTerminal(value);
                        });
                    }).catch(error => {
                        Toast(error)
                    });
                })

            },

            // 解绑终端号
            unbindTerminal (value) {
                Auth.getToken().then((info) => {
                    let options = {
                        method: 'POST',
                        body: {
                            token: info.token,
                            terminalSn: value
                        },
                        loading: true
                    };
                    Api.unbindTerminal(options).then((result) => {
                        let { code, msg } = result;
                        if (code !== '000000') throw msg;
                        Channel.post($$RefreshDetail, {});
                        Toast('删除成功');
                    }).catch(error => {
                        Toast(error)
                    });
                });
            },
            handleRadio(item, key) {
                this.radio_arr.value = item.value;
            },
            // 赋值
            handleInput (item, event) {
                item.value = event.value;
            },

            forEach(obj, callback) {
                for (let key in obj) {
                    callback && callback(obj[key], key);
                }
            },
            handleSwitch(item, index) {
                if (this.change_index === item.value) return null;
                this.change_index = item.value;
                this.change_arr.forEach((item, i) => {
                    item.checked = i === index;
                });
            },
            handleEdit(item) {
                this.is_change = !this.is_change;
                this.sn_item = item;
            },
            // 添加
            handleAdd (callback) {
                callback();
                let length = this.install_arr.length;
                if (length && !this.install_arr[length - 1].snCode.value) return;
                if (length >= 5) return Toast('只能绑定5个SN号');
                // this.install_arr.push({ snCode: '', disabled: false });
                var init = { snCode: { value: '', terminalNo: '', disabled: false, label: 'SN号', use_slot: true, use_placeholder: true, is_margin: true }, terminalNo: { value: '', disabled: true, label: '终端号' } }

                this.install_arr.push(init);
            },
            handleNull() { },
        },
        components: {
            WowInputCell,
            WowButton,
        }
    }
</script>
<style>
    .cell-item{
        background-color: #fff;
    }
    .input-edit {
        flex-direction: row;
        margin-right: 32px;
        width: 120px;
        align-items: center;
        justify-content: space-between;
    }
    .edit-image {
        width: 40px;
        height: 40px;
    }
    .input-line {
        width: 1px;
        height: 40px;
        background-color: #D5D5D5;
    }
    .input-unit{
        border-left-width: 1px;
        border-color: #D5D5D5;
        align-items: center;
        width: 120px;
        justify-content: center;
    }
    .sure-text{
        text-align: center;
        color: #333;
        font-size: 28px;
    }
    .button{
        margin-left: 30px;
    }
    .margin {
        margin-top: 10px;
    }
    .pop-wrap {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.3);
        justify-content: center;
        align-items: center;
    }

    .pop-prompt {
        margin-top: 32px;
        font-size: 28px;
        color: #000000;
    }

    .buss-inner {
        width: 540px;
        align-items: center;
        background-color: #fff;
        height: 300px;
        border-radius: 28px;
    }

    .buss-inner-txt {
        width: 540px;
        padding-left: 78px;
        flex-direction: row;
        /* justify-content: center; */
        /* align-items: center; */
        height: 212px;
    }
    .pop-title {
        font-size: 34px;
        color: #373737;
        position: absolute;
        top: 38px;
        margin-left: 46px;
    }
    .radio-item{
        margin-left: 46px;
        margin-top: 124px;
        flex-direction: row;
    }
    .radio-image {
        width: 40px;
        height: 40px;
        margin-right: 10px;
    }
    .radio-text{
        font-size: 26px;
        line-height: 32px;
        color: #373737;
    }
    .buss-sure-btn {
        border-top-color: #E5E5E5;
        border-top-width: 2px;
        width: 540px;
        height: 88px;
        border-radius: 8px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .buss-btn-sure {
        flex: 1;
        justify-content: center;
        align-items: center;
        border-right-color: #E5E5E5;
        border-right-width: 2px;
        height: 88px;
    }

    .buss-btn-cancel {
        flex: 1;
        justify-content: center;
        align-items: center;
        height: 88px;
    }

    .buss-sure-btn-text {
        font-size: 34px;
        color: #0076FF;
        flex: 1;
        height: 88px;
        line-height: 88px;
        text-align: center;
    }
    .buss-channel-btn-text {
        font-size: 34px;
        color: #868686;
        flex: 1;
        border-right-color: #E5E5E5;
        border-right-width: 2px;
        height: 88px;
        line-height: 88px;
        text-align: center;
    }
    .change-inner {
        width: 540px;
        /*align-items: center;*/
        background-color: #fff;
        height: 534px;
        border-radius: 28px;
    }
    .change-title {
        /*width: 456px;*/
        height: 44px;
        margin-top: 40px;
        margin-left: 32px;
        margin-right: 32px;
        line-height: 44px;
        text-align: center;
        font-size: 34px;
        color: #373737;
    }
    .change-option {
        flex-direction: row;
        margin-top: 30px;
        margin-bottom: 40px;
        margin-left: 32px;
        margin-right: 32px;
        justify-content: space-between;
    }
    .change-item {
        height: 52px;
        line-height: 52px;
        padding-left: 24px;
        padding-right: 24px;
        border-radius: 200px;
    }
    .change-sn-title {
        margin-left: 32px;
        font-size: 26px;
        color: #373737;
        margin-bottom: 10px;
    }
    .change-input {
        width: 476px;
        height: 88px;
        margin-left: 32px;
        /* margin-bottom: 62px; */
        padding-left: 32px;
        padding-top: 22px;
        padding-bottom: 22px;
        font-size: 32px;
        color: #333;
        border-color: #EFEFF4;
        border-width: 2px;
        border-radius: 8px;
    }
    .tip-txt {
        font-size: 28px;
        color: rgba(51, 51, 51, 0.699);
        /* line-height: 40px; */
        /* height: 40px; */
        margin-top: 20px;
        margin-bottom: 28px;
        margin-left: 32px;
        margin-right: 32px;
    }
</style>
