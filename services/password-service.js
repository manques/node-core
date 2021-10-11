/**
 *  Hash password service
 * 
 */
// Dependencies
const crypto = require('crypto');
const config = require('../config');
// password container
const passwordService = {};

// hash password using sha256
passwordService.hash = (password) => {
    // hash password 
    if(typeof(password) === 'string' && password.length > 0){
        const hash = crypto.createHash('sha256', config.passwordSecret)
                       .update(password)
                       .digest('hex');
        return hash;
    } else {
        return false;
    }
}

module.exports = passwordService;