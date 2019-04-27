
const filters = {

    // 过滤姓名
    filterName (value) {
        // return value ? value.replace(/.(?=.)/g, '*') : '';
        return value ? value.substring(0,1) + new Array(value.length).join('*') : '';
    },

    // 过滤手机号
    filterPhone (value) {
        return value ? value.substring(0,3) + '****' + value.substring(7) : '';
    },

    // 过滤银行卡
    filterCard (value) {
        return value ? value.substr(0, 6) + '****' + value.substr(value.length - 4, 4) : '';
    },

    // 过滤身份证
    filterId (value) {
        return value ? value.substring(0,6) + '********' + value.substring(14) : '';
    }
};

export default {
    filters
}
