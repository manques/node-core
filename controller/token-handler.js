/*
 *  All token handler and crud operation
 */

// dependencies
const { fieldChecker, validityEvery, validitySome } = require('../services/field-service');
const passwordService = require('../services/password-service');
const _data = require('../lib/data');
const randomService = require('../services/random-service');

// token container
const token = {};

// token post
// required data: username, password
// optional data: none
token.post = (data, callback) => {
    // data
    const username = fieldChecker(data.payload.username, 'phone', 10);
    const password = fieldChecker(data.payload.password, 'string');
    const fields = { username, password };
    if(validityEvery(fields)) {
        _data.read('users', username, (err, data) => {
            if(!err && data){
                const hash = passwordService.hash(password);
                if(hash === data.password) {
                    const tokenId = randomService.random(20);
                    const expires = Date.now() + (1000*60*60*1);
                    const token = {
                        username,
                        id: tokenId,
                        expires
                    };
                   _data.create('tokens', tokenId, token, err => {
                       if(!err) {
                            callback(false, token);
                       } else {
                        callback(400, 'could not create token!!');
                       }
                   });
                } else {
                    callback(400, { Error: 'Wrong password' });
                }
            } else {
                callback(404, { Error: `no user found this ${username}`});
            }
        });
        
    } else {
        callback(400, { Error: 'Missing required fields'});
    }
}

// token get
// required data: token id
// optional data: none
token.get = (data, callback) => {
    // check id field exist
    const id = fieldChecker(data.queryStringObject.id, 'string');
    // check validity of id
    if(validityEvery(id)) {
        // get token data
        _data.read('tokens', id, (err, data) => {
            if(!err && data){
                callback(false, data);
            }else {
                callback(404, { Error: 'token not found'});
            }
        });
    } else {
        callback(400, { Error: 'missing required field!!'});
    }
}


// token update
// required data: id, extend: boolean
// optional field: none

token.put = (data, callback) => {
    // check field value exist
    console.log(data);
    const id = fieldChecker(data.payload.id, 'string');
    const extend = fieldChecker(data.payload.extend, 'boolean', true);
    const fields = { id, extend };
    console.log(fields);
    // check fields validity
    if(validityEvery(fields)){
        // get token data
        _data.read('tokens', id, (err, token) => {
            if(!err && token){
                // check token expiration time
                if(token.expires > Date.now()){
                    // set new expiration
                    token.expires = Date.now() + (1000 * 60 * 60 * 1);
                    // store new update
                    _data.update('tokens', id, token, (err) => {
                        if(!err){
                            callback(false, token);
                        } else {
                            callback(500, { Error: 'could not update token expiration'});
                        }
                    });
                } else {
                    callback(400, { Error: 'token is already expired'});
                }
            } else {
                callback(400, 'token is not found');
            }
        });
    } else {
        callback(400, { Error: 'missing required field' });
    }
}

// delete token 
// required data: id,
// optional data: none
token.delete = (data, callback) => {
    // get id and valid id
    const id = fieldChecker(data.queryStringObject.id, 'string');
    // check the field validity 
    if(validityEvery(id)){
        // read token 
        _data.read('tokens', id, (err, token) => {
            if(!err && token) {
                // delete token 
                _data.delete('tokens', id, err => {
                    if(!err) {
                        callback(false, {id});
                    }else {
                        callback(500, { Error: 'problem delete token'});
                    }
                });
            } else {
                callback(400, { Error: 'No token found this id'});
            }
        });
    }else {
        callback(400, { Error: 'missing required field!!'});
    }
    
}

module.exports = token;