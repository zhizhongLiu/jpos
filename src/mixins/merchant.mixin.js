const filters = {
    filterField(value, type, disabled) {
        if(!disabled) return value;
        if( disabled && type === 'phone') return value ? value.substring(0,3) + '****' + value.substring(7) : '';
        if( disabled && type === 'certPid') return value ? value.substring(0,10) + "******" : '';
        if( disabled && type === 'name') return value ? value.replace(/.(?=.)/g, '*') : ''
        if( disabled && type === 'card') return value ? value.replace(/(\d{4})\d+(\d{4})/, "$1********$2") : ''
        // {
        //     return value ? value.replace(/.(?=.)/g, '*') : ''
        //     let str='';
        //     for( var i=0; i<value.length-1; i++){
        //         str+='*';
        //     }
        //     return value.substring(0,1)+str;
        // }
        return value;
    }
};

export default {
    filters,
}
