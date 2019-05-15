/*
* Primary file for the API
*
*
*/

// Dependencies
const http = require('http');
const url = require('url');

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

    // Send response
    res.end('Hello World\n');

    // Log the request path
    console.log('Request received on path: '+ trimmedPath + 'with method: '+ method +'Query string: ', queryStringObject);

});

// Start the server, and have it listen on port 3000
server.listen(3000, function() {
    console.log('*** The server is listening on port 3000 ***')
})