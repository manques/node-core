const _data = require('../lib/data');
const { fieldChecker, validityData } = require('../services/field-service');
const passwordService = require('../services/password-service');

// user container for all method
const user = {};

// user post
// require data: name, email, phone, password, isAgreement
// optional data: none
user.post = (data, callback) => {
    // check that all required field are filled out
    const name = fieldChecker(data.payload.name, 'string');
    const email = fieldChecker(data.payload.email, 'string');
    const phone = fieldChecker(data.payload.phone, 'number', 10);
    const password = fieldChecker(data.payload.password, 'string');
    const isAgreement = fieldChecker(data.payload.isAgreement, 'boolean', true);
    const fields = {
        name, 
        email, 
        phone, 
        password, 
        isAgreement
    };
    if(validityData(fields)) {
        // make sure that the user doesnot already exist.
        _data.read('users', phone, (err, data) => {
            if(err){
                callback(400, { Error: `user of this ${phone} already exist!!` });
            } else {
                // hash password
                const hashPassword = passwordService.hash(password);
                if(hashPassword){
                    fields.password  = hashPassword;
                    _data.create('users', phone, fields, err => {
                        if(err) {
                            callback('Error create new user!!');
                        } else {
                            callback(false);
                        }
                    });
                } else {
                    callback(400, { Error: 'could not hash the user\'s password!!'});
                }
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
}

// user update
user.put = (data, callback) => {
    
}

// user delete
user.delete = (data, callback) => {
    
}

module.exports = user;

