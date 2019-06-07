// Library for storing and editing data

// Dependencies
var fs = require('fs');
var path = require('path');

// Container for the module 

var lib = {};

// Base directory of the data folder - Makes everyithing into one nice path.
lib.baseDir = path.join(__dirname,'/../.data/');

// write data to file
lib.create = function(dir, file, data, callback) {
    // Write data to a file
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', function(err, fileDescriptor) {
        if(!err && fileDescriptor) {
            // Convert data to string
            var stringData = JSON.stringify(data);
            
            // Write to file and close it
            fs.writeFile(fileDescriptor, stringData, function(err) {
                if(!err){
                    fs.close(fileDescriptor, function(err) {
                        if(!err) {
                            callback(false);
                        } else {
                            callback('Error closing new file');
                        }
                    })
                } else {
                    callback('Error writing to new file');
                }
            });
        } else {
            callback('Could not create new file, it may already exist');
        }
    });
};

// Read data from a file
lib.read = function(dir, file, callback) {
    fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf8', function(err, data) {
        callback(err, data);
    });
};

// Update data inside a file
lib.update = function(dir, file, data, callback) {
    // Open the file for writing
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', function(err, fileDescriptor) {
        if (!err && fileDescriptor) {
            console.log(fileDescriptor)
            var stringData = JSON.stringify(data);

            // Truncate the file
            fs.ftruncate(fileDescriptor, function(err) {
                if (!err) {
                    // Write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, function(err) {
                        if (!err) {
                            fs.close(fileDescriptor, function(err) {
                                if (!err) {
                                    callback(false);
                                } else {
                                    callback('Error closing file');
                                }
                            })
                        } else {
                            callback('Error writing to existing file');
                        }
                    })
                } else {
                    callback('Error truncating file');
                }
            });
        } else {
            callback('Could not open the file for updating. It may not exist yet')
        }
    });
};

module.exports = lib;