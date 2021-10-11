/*
 *  Convert json to object
 */

// json container
const jsonService = {};



jsonService.jsonToObject = (str) => {
    try {
        const obj = JSON.parse(str);
        return obj;
    } catch(e) {
        return {};
    }
}

jsonService.objectToJson = (obj) => {
    try {
        const json = JSON.stringify(obj);
        return json;
    } catch(e) {
        return {};
    }
}


module.exports = jsonService ;