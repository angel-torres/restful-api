/*
Helpers for various tasks
*/

// Dependencies
var crypto = require('crypto');
var config = require('./config');

// Container for all the helpers 
const helpers = {};

helpers.hash = function(str) {
    if(typeof(str) === 'string' && str.length > 0) {
        const hash = crypto.createHmac('sha256', confi.hashingSecret).update(str).digest('hex');
        return hash
    } else {

    }
};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function(str){
    try {
        var obj = JSON.parse(str);
        return obj;
    } catch (err) {
        return {};
    }
};





// Export modules
module.exports = helpers;