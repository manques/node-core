/*
    handle all request
*/

// dependencies
const user = require('./user-handler');
const cart = require('./cart-handler');

// routes handler object
const handlers = {
    // user,
    // cart
};
const acceptableMethod = ['post', 'get', 'put', 'delete'];
// user routes handler


handlers.userHandler = (data, callback) => {
    
    if(acceptableMethod.indexOf(data.method) > -1){
        user[data.method](data, callback);
    } else {
        callback('405');
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

