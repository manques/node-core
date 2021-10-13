/*
    handle all request
*/

// dependencies
const user = require('./user-handler');
const cart = require('./cart-handler');
const token = require('./token-handler');

// routes handler object
const handlers = {};

// all acceptable methods for any rest api called
const acceptableMethod = ['post', 'get', 'put', 'delete'];

// user routes handler
handlers.userHandler = (data, callback) => {
    
    if(acceptableMethod.indexOf(data.method) > -1){
        user[data.method](data, callback);
    } else {
        // console.log(405);
        callback(405, { Error: 'Method not allow!!'});
    }
} 
// token routes handler
handlers.tokenHandler = (data, callback) => {
    if(acceptableMethod.indexOf(data.method) > -1){
        token[data.method](data, callback);
    } else {
        // method not allow
        callback(405, { Error: 'Method not allow!!'});
    }
}

// cart routes handler
handlers.cartHandler = (data, callback) => {
    if(acceptableMethod.indexOf(data.method) > -1){
        cart[data.method](data, callback);
    } else {
        callback('405');
    }
}


// not found handler 404
handlers.notFound = (data, callback) => {
    callback(404);
}

// console.log(handlers);

module.exports = handlers;

