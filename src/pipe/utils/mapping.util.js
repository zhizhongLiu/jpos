
export default {
    init (source_data, mapping_config = {}) {
        let result_data = {};
        this.forEach(mapping_config, (item, key) => {
            result_data[item] = source_data[key] || '';
        });
        return result_data;
    },
    forEach (obj, callback) {
        for(let key in obj){
            callback && callback(obj[key], key);
        }
    }
}
