import config from 'config/env.config'

let source = (name) => {
    return config.SOURCE_URL + name;
};

source.getJson = (name) => {
    return config.JSON_URL + name;
};

export default source;
