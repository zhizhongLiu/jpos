
import request  from 'helpers/request';
import City     from './extends/city.extend'



export default {

    // 卡bin查询
    queryCardBinByCardNumber (options = {}) {
        return request('/v1/pos/redo/queryCardbin', options);
    },
    // 获取开户行列表
    getBankList () {
        return http('bank_code.json');
    },
    // 支行信息列表
    fetchBranchBankList (options = {}) {
        return request('/v1/pos/redo/queryBankNoList', options);
    },

    // 业务员权限查询
    fetchUserAuthority (options = {}) {
        return request('/v1/pos/redo/judge_role', options);
    },

    // 商户进件列表
    fetchMerchantList (options = {}) {
        return request('/v1/pos/redo/queryMerList', options);
    },

    // 图片上传
    uploadImage (options = {}) {
        return request('/v1/pos/redo/upload_file', options);
    },
    // 图片下载
    downloadImage (options = {}) {
        return request('/v1/pos/redo/download_file', options);
    },

    // 获取验证码
    sendCode (options = {}) {
        return request('/v1/public/send_verify_code', options);
    },

    // 获取地址信息
    ...City,

    // 验证验证码
    checkCode (options = {}) {
        return request('/v1/pos/redo/check_code', options);
    },

    // 获取开户地
    fetchCity (options = {}) {
        return request('/v1/commercial/city_list_all', options);
    },

    // 获取MCC码
    fetchMccList () {
        return http('cmmtmcc.json');
    },

    // 提交进件
    subData (options = {}) {
        return request('/v1/pos/redo/mer_add', options);
    },

    // 获取终端类型
    fetchTerminalType (options = {}) {
        return request('/v1/pos/redo/terminal_info', options);
    },

    // 绑定终端
    bindTerminal (options = {}) {
        return request('/v1/pos/redo/terminal_bind_new', options);
    },

    // 解绑终端
    unbindTerminal (options = {}) {
        return request('/v1/agent/updateTerminalUntie', options);
    },

    // 终端换机
    changeTerminal (options = {}) {
        return request('/v1/agent/changePospTerminal', options);
    },

    // 修改资料
    updateMerchantInfo (options = {}) {
        return request('/v1/pos/redo/mer_update', options);
    },

    // 详情的接口
    fetchMerchantInfo (options = {}) {
        return request('/v1/pos/redo/queryMerDetail', options);
    },
    fetchCard(options = {}) {
        return request('CreditCardIdentificationPmoListQuery.Req', options);
    },
    AddCreditCard(options = {}) {
        return request('/v1/agent/creditCardVerification', options);
    }
}
