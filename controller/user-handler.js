const _data = require('../lib/data');
const { fieldChecker, validityEvery, validitySome } = require('../services/field-service');
const passwordService = require('../services/password-service');

// user container for all method
const user = {};

// user post
// require data: name, email, phone, password, isAgreement
// optional data: none
user.post = (data, callback) => {
    console.log(data);
    // check that all required field are filled out
    const name = fieldChecker(data.payload.name, 'string');
    const email = fieldChecker(data.payload.email, 'string');
    const phone = fieldChecker(data.payload.phone, 'phone', 10);
    const password = fieldChecker(data.payload.password, 'string');
    const isAgreement = fieldChecker(data.payload.isAgreement, 'boolean', true);
    const fields = {
        name, 
        email, 
        phone, 
        password, 
        isAgreement
    };
    console.log(fields);
    if(validityEvery(fields)){
        // make sure that the user doesnot already exist.
        _data.read('users', phone, (err, data) => {
            console.log(err);
            if(err && !data){
                   // hash password
                   const hashPassword = passwordService.hash(password);
                   if(hashPassword){
                       fields.password  = hashPassword;
                       console.log('---  create user ---');
                       _data.create('users', phone, fields, err => {
                           if(!err) {
                            callback(false, fields);
                           } else {
                               callback('Error create new user!!');
                           }
                       });
                   } else {
                       callback(400, { Error: 'could not hash the user\'s password!!'});
                   }
            } else {
                callback(400, { Error: `user of this ${phone} already exist!!` });
            }
        });
    } else {
        callback(400, { Error: 'Missing required fields' });
    }
}

// user get
// required data: phone
//  optional data: none
// @TODO  Only let an authenticated user access their object, Don't let them access anyone.
user.get = (data, callback) => {
    // check that the phone number  is valid
    console.log(data);
    const phone = fieldChecker(data.queryStringObject.phone, 'phone', 10);
    if(validityEvery({phone})) {
        _data.read('users', phone, (err, user) => {
            console.log(err);
            console.log(user);
            if(!err && user){
                delete user.password;
                callback(200, user);
            } else {
                callback(400, { Error: 'user is not exists!!'});
            }
        });
    } else {
        callback(404, { Error: 'Phone required fields' });
    }
}

// user update
// required data: phone
// optional data: name, email, password
// @TODO only let an authenticated user access their object, Don't let them access anyone.
user.put = (data, callback) => {
    // check that the phone number  is valid
    console.log(data);
    const phone = fieldChecker(data.payload.phone, 'phone', 10);
    if(validityEvery({phone})) {
         // check that all required field are filled out
        const name = fieldChecker(data.payload.name, 'string');
        const email = fieldChecker(data.payload.email, 'string');
        const password = fieldChecker(data.payload.password, 'string');
        const fields = {
            name, 
            email,
            password, 
        };
        console.log(fields);
        if(validitySome(fields)){
            // make sure that the user doesnot already exist.
            _data.read('users', phone.toString(), (err, user) => {
                console.log(err);
                if(!err){
                        if(name) {
                            user.name = name;
                        }
                        if(email){
                            user.email = email;
                        }
                       if(password){
                            // hash password
                            const hashPassword = passwordService.hash(password);
                            user.password = hashPassword;
                       } 
                       
                        _data.update('users', phone, user, err => {
                            if(!err) {
                                delete user.password;
                            callback(false, user);
                            } else {
                                callback('Error update user!!');
                            }
                        });
                } else {
                    callback(400, { Error: `user of this ${phone} is not exist!!` });
                }
            });
        } else {
            callback(400, { Error: 'Missing required fields' });
        }
    } else {
        callback(404, { Error: 'Phone required fields' });
    }
}

// user delete
// required data: phone
// @TODO only let an authenticated user delete object, Don't let delete anyone
user.delete = (data, callback) => {
    const phone = fieldChecker(data.queryStringObject.phone, 'phone', 10);
    if(validityEvery({phone})) {
        _data.delete('users', phone, err => {
            if(!err){
                callback(false, {phone});
            } else {
                callback(404, { Error: 'user is not exists!!'});
            }
        });
    } else {
        callback(404, { Error: 'phone required field.'});
    }
}

module.exports = user;

