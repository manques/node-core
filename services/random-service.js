const _data = require('../lib/data');

const randomService = {};
randomService.random = (length) => {
    const alphnumberic = `abcdefghijklmnopqrstuvwxyz0123456789`;
    let randomString = '';
    for(let i = 0; i < length; i++) {
        let index = Math.floor(Math.random() * alphnumberic.length);
        randomString += alphnumberic.charAt(index);
    }
    return randomString;
}

randomService.tokenVerify = (id, phone, callback) => {
    // get token store from this id
    _data.read('tokens', id, (err, token) => {
        if(!err && token){
            // check username && expiration time
            if(token.username === phone && token.expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        }else {
            callback(false);
        }
    });

}

module.exports = randomService;