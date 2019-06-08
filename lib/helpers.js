/*
Helpers for various tasks
*/

// Dependencies
var crypto = require('crypto');
var confit = require('../config');

// Container for all the helpers 
const helpers = {};

helpers.hash = function(str) {
    if(typeof(str) === 'string' && str.length > 0) {
        const hash = crypto.createHmac('sha256', confi.hashingSecret).update(str).digest('hex');
        return hash
    } else {

    }
}

// Export modules
module.exports = helpers;