
import Dialogs                  from 'plugins/dialogs'

export default {

    assignmentData (source_params, result_params) {
        this.forEach(result_params, (item, key) => {
            if (source_params[key] || source_params[key] === false){
                item.value = source_params[key]
            }
        })
    },

    checkData (source_params, options = { mode: true }) {

        let type = null;
        try {
            this.forEach(source_params, (param, key) => {
                let { use_check, value, visible } = param;
                if (!use_check || visible === false) return null;
                use_check.forEach((item) => {
                    let {nonempty, rule, gt, lt, type, prompt} = item;
                    if (nonempty && (!value && value !== false)) {
                        param.is_error = true;
                        throw prompt;
                    }
                    if (value && typeof rule === 'function' && !rule(value)) {
                        param.is_error = true;
                        throw prompt;
                    }
                    if (value && typeof rule === 'object' && !rule.test(value)) {
                        param.is_error = true;
                        throw prompt;
                    }
                    if (gt && type === 'date' && value) {
                        let gt_value = source_params[gt].value;
                        if(!gt_value) return;
                        let time1 = value.indexOf('-') < 0 ? value.substring(0, 4) + '-' + value.substring(4, 6) + '-' + value.substring(6, 8) : value;
                        let time2 = gt_value.indexOf('-') < 0 ? gt_value.substring(0, 4) + '-' + gt_value.substring(4, 6) + '-' + gt_value.substring(6, 8) : gt_value;

                        let num1 = new Date(time1).getTime();
                        let num2 = new Date(time2).getTime();
                        if (num1 && num2 && num1 <= num2) {
                            source_params[gt].is_error = true;
                            throw prompt;
                        }
                    }
                    if (lt && type === 'date' && value) {
                        let lt_value = source_params[lt].value;
                        if(!lt_value) return;
                        let time1 = value.indexOf('-') < 0 ? value.substring(0, 4) + '-' + value.substring(4, 6) + '-' + value.substring(6, 8) : value;
                        let time2 = lt_value.indexOf('-') < 0 ? lt_value.substring(0, 4) + '-' + lt_value.substring(4, 6) + '-' + lt_value.substring(6, 8) : lt_value;

                        let num1 = new Date(time1).getTime();
                        let num2 = new Date(time2).getTime();
                        if (num1 && num2 && num1 > num2) {
                            source_params[lt].is_error = true;
                            throw prompt;
                        }
                    }
                    if (gt && value && value < +source_params[gt].value) {
                        param.is_error = true;
                        throw prompt;
                    }
                    if (lt && value && value > +source_params[lt].value) {
                        param.is_error = true;
                        throw prompt;
                    }
                })
            });
        } catch (error) {
            console.log('error', error)
            options.mode && Dialogs.toast({message: error});
            type = true;
        }
        return type;
    },

    filterData (source_params, expect_params, type = false) {
        let result = {};
        !expect_params && (expect_params = source_params);
        this.forEach(expect_params, (item, key) => {
            if (type && item.visible !== false) {
                result[key] = source_params[key].value;
            } else if (!type && item.use_filter !== false) {
                result[key] = source_params[key].value;
            }
        });
        return result;
    },

    checkAble (source_params) {
        let type = false;
        try {
            this.forEach(source_params, (param, key) => {
                let { use_check, value, visible } = param;
                if (!use_check || visible === false) return null;
                use_check.forEach((item, index) => {
                    let { nonempty } = item;
                    if (nonempty && (!value && value !== false)) throw key + '不可点击';
                })
            });
        } catch (e) {
            // console.log(e);
            type = true;
        }
        return type;

    },

    forEach (obj, callback) {
        for(let key in obj){
            callback && callback(obj[key], key);
        }
    },

    checkDataChange (old_params, new_params) {
        let type = false;
        this.forEach(new_params, (item, key) => {
            if (typeof old_params[key] === 'undefined') old_params[key] = '';
            if (item != old_params[key]) {
                console.log('有改变 =>', item, key, '旧值', old_params[key]);
                // Dialogs.toast({ message: key + ' | ' + old_params[key]})
                return type = true;
            }
        });
        return type;
    },
}
