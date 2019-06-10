/*
 * Request handlers
*
*/

// Dependencies 
const _data = require('./data');
const helpers = require('./helpers');

// Define the handlers
var handlers = {};

// Users
handlers.users = function (data, callback) {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Containers for the users submethods
handlers._users = {};

// Users - post 
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = function (data, callback) {
    // Check that all required fields are filled out
    const firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;

    const lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;

    const phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone.trim() : false;

    const password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    const tosAgreement = typeof (data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // Make sure that the user doesn't already exist
        _data.read('users', phone, function (err, data) {
            if (err) {
                // Hash the password
                const hashedPassword = helpers.hash(password);

                // Create the user object
                if (hashedPassword) {
                    const userObject = {
                        'firstName': firstName,
                        'lastName': lastName,
                        'phone': phone,
                        'hashedPassword': hashedPassword,
                        'tosAgreement': true
                    };


                    // Store the user
                    _data.create('users', phone, userObject, function (err) {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, { 'Error': 'Could not creat the new user' });
                        }
                    });
                } else {
                    callback(500, { 'Error': 'Could not hash the user\'s password' })
                }




            } else {
                callback(400, { 'error': 'a user with that phone number already exists' });
            }
        });
    } else {
        callback(400, { 'error': 'missing required fields' });
    }
};

// Users - get 
// Required data: phone
// Optional data: none
//@TODO Only let authenticated users access their object. Don't let them access anyone elses
handlers._users.get = function (data, callback) {
    // Check that the phone number is valid
    var phone = typeof (data.queryStringObject.phone) === 'string' && data.queryStringObject.phone.length === 10 ? data.queryStringObject.phone.trim() : false;
    if (phone) {
        _data.read('users', phone, function (err, data) {
            if (!err && data) {
                // Remove hashed password from the user object before returning to requester
                delete data.hashedPassword;
                callback(200, data);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field' })
    }
};

// Users - put 
// Required data : phone
// Optional data: firstName, lastName, password (at least one must be specified)
// @TODO Only let authenticated users access their object. Don't let them access anyone elses
handlers._users.put = function (data, callback) {
    // Check for the required field
    const phone = typeof (data.payload.phone) === 'string' && data.payload.phone.length === 10 ? data.payload.phone.trim() : false;

    // Check for optional fields
    const firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;

    const lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;

    const password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    // Error if the phone is valid
    if (phone) {
        // Error if nothing is sent to update
        if (firstName || lastName || password) {
            // Lookup user
            _data.read('users', phone, function (err, userData) {
                if (!err && userData) {
                    // Update the fields necessary
                    if (firstName) {
                        userData.firstName = firstName;
                    }
                    if (lastName) {
                        userData.lastName = lastName;
                    }
                    if (password) {
                        userData.hashedPassword = helpers.hash(password);
                    }
                    // Store the new updates
                    _data.update('users', phone, userData, function (err) {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, { 'Error': 'Could not update the user' });
                        }
                    })
                } else {
                    callback(400, { 'Error': 'The specified user does not exist' })
                }
            })
        } else {
            callback(400, { 'Error': 'Missing fields to update' });
        }
    } else {
        callback(400, { 'Error': 'Missing required field' });
    }

};

// Users - delete 
// Required field: phone
// @TODO Only let an authenticated user delete their object. Dont let them delete anyone elses
// @TODO Cleanup (delete) any other data files associated with this user
handlers._users.delete = function (data, callback) {
    // Check that the phone number is valid
    var phone = typeof (data.queryStringObject.phone) === 'string' && data.queryStringObject.phone.length === 10 ? data.queryStringObject.phone.trim() : false;
    if (phone) {
        // Lookup the user
        _data.read('users', phone, function (err, data) {
            if (!err && data) {
                //
                _data.delete('users', phone, function(err, data){
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, {'Error': 'Could not delete specified user'});
                    }
                });
            } else {
                callback(400, {'Error': 'Could not find the specified user'});
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field' })
    }
};

// Tokens
handlers.tokens = function (data, callback) {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for all the tokens methods
handlers._tokens = {};

// Tokens - post
// Required data: phone, password
// Optional data: none
handlers_tokens.post = function(data, callback){
    const phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone.trim() : false;

    const password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if (phone && password) {
        // Lookup the user who matches that phone number
        _data.read('users', phon, function(err, userData){
            if (!err && userData) {
                // Hash the sent password, and store it in the 
                const hashedPassword = helpers.hash(password);
                if (hashedPassword === userData.hashedPassword) {
                    // If valid, create a new token with a random name. Set expiration date 1 hr in the future
                    const tokenId = helpers.createRandomString(20);
                    const expires = Date.now() + 1000 * 60 * 60
                    const tokenObject = {
                        'phone': phone,
                        'id': tokenId,
                        'expires' : expires
                    };

                    // Store the token
                    _data.create('tokens', tokenId, tokenObject, function(err){
                        if (!err) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, {'Error': 'Vould not create the new token'})
                        }
                    });
                } else {
                    callback(400, {'Error': 'Password did not match the specified user\'s stored password'})
                }
            } else {
                callback(400, {'Error': 'Could not find the specified user'})
            }
        })
    } else {
        callback(400, {'Error': 'Missing required field(s)'});
    }
};


// Ping handler
handlers.ping = function (data, callback) {
    callback(200);
};

// Not found handler
handlers.notFound = function (data, callback) {
    // Callback a http status code, and a payload object
    callback(404);
};


// Export the module
module.exports = handlers