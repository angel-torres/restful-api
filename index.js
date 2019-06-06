/*
* Primary file for the API
*
*
*/

// Dependencies
const http = require('http'); // 
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

// The server should respond to all requests with a string
var server = http.createServer(function (req, res) {

    // Get the URL and parse it
    const parsedUrl = url.parse(req.url, true);

    // Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '')

    // Get the query string ad an object
    const queryStringObject = parsedUrl.query;

    // Get the HTTO Method
    const method = req.method.toLowerCase();

    // Get the headers as an object
    const headers = req.headers;

    // Get the payload, if any

    const decoder = new StringDecoder('utf-8');

    var buffer = '';

    req.on('data', function (data) {
        buffer += decoder.write(data);
    });

    req.on('end', function () {
        buffer += decoder.end();

        // Choose the handler this request should go to. If one is not found use the default handler/notFound
        var chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Construct the dta object to send to the handler
        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        }

        // Route the request to the handlers specified in the router
        chosenHandler(data, function (statusCode, payload) {
            // Use the status code called back by the handler or default to 200
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

            // Use the payload called back by the handler or default to an empty object
            payload = typeof (payload) == 'object' ? payload : {};

            // Convert the payload to a string
            var payloadString = JSON.stringify(payload)

            res.setHeader('Content-Type', 'application/json');

            res.writeHead(statusCode);

            res.end(payloadString);
            console.log('Returing this response: ', statusCode, payloadString);
        })

        // Send response

        // Log the request path
    });


});

// Start the server, and have it listen on port 3000
server.listen(config.port , function () {
    console.log(`*** The server is listening on port ${config.port} ***`)
})

var handlers = {

}

handlers.sample = function (data, callback) {
    callback(406, { 'name': 'sample handler' })
}

handlers.notFound = function (data, callback) {
    // Callback a http status code, and a payload object
    callback(404)
}

// Define a request router
var router = {
    'sample': handlers.sample
}