/*
* Primary file for the API
*
*
*/

// Dependencies
const http = require('http'); // 
const https = require('https'); // 
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');

// Instantiating http server
const httpServer = http.createServer(function (req, res) {
    unifiedServer(req, res);
});

// Start the server, and have it listen on port 3000
httpServer.listen(config.httpPort, function () {
    console.log(`*** The server is listening on port ${config.httpPort} ***`)
});

// Instantiate HTTPS server
const httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
}

const httpsServer = https.createServer(httpsServerOptions, function (req, res) {
    unifiedServer(req, res);
});

// Start HTTPS server

httpsServer.listen(config.httpsPort, function () {
    console.log(`*** The server is listening on port ${config.httpsPort} ***`)
});

// All the server logic for both the http and https server
var unifiedServer = function (req, res) {

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
            'payload': helpers.parseJasonToObject(buffer)
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

            // Send response
            res.end(payloadString);
            console.log('Returing this response: ', statusCode, payloadString);
        });
    });

};



// Define a request router
var router = {
    'ping': handlers.ping,
    'users': handlers.users
};

// to Generate https support key and cer type `openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem` inside terminal. This generates .pem files. 