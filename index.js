/*
* Primary file for the API
*
*
*/

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// The server should respond to all requests with a string
var server = http.createServer(function(req, res) {

    // Get the URL and parse it
    const parsedUrl = url.parse(req.url, true);

    // Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g,'') 

    // Get the query string ad an object
    const queryStringObject = parsedUrl.query;

    // Get the HTTO Method
    const method = req.method.toLowerCase();

    // Get the headers as an object
    const headers = req.headers;

    // Get the payload, if any

    const decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data) {
        buffer + decoder.write(data);
    });
    req.on('end', function() {
        buffer+= decoder.end();

        res.end('Hello World\n');
    
        // Log the request path
        console.log('Request received with this payload: ', buffer);
    });


    // Send response

});

// Start the server, and have it listen on port 3000
server.listen(3000, function() {
    console.log('*** The server is listening on port 3000 ***')
})