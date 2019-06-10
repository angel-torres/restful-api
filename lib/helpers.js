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
        const hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
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

// Vreate a string of random alphanumeric charachters, of a given length
helpers.createRandomString = function(strLength){
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
    if (strLength) {
        // Define all the possible characters that could go into a string
        var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789'
        ;
        // Start the final string
        var str = '';
        for (let i = 1; i <= strLength; i++) {
            // Get a random character from the possible characters string
            var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            // Append this character in the final string
            str+=randomCharacter
        };
        console.log(str)
        // Return the final string
        return str;
    } else {
        
    }
};



// Export modules
module.exports = helpers;