/*
    Primary file for the API

*/

// dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const config = require('./config');
const fs = require('fs');
const _data = require('./lib/data');
const handlers = require('./controller/handlers');

// http server should respond all request!!
const httpServer = http.createServer((req, res)=>{
    unifiedServer(req, res);
});

// start http server and listen port
httpServer.listen(config.httpPort, () => {
    console.log(`server listenining at ${config.httpPort} ${config.envName}!!`);
});

// import https  options 
const httpsOptions = {
    key: fs.readFileSync('./https/key.pem'),
    cert: fs.readFileSync('./https/cert.pem')
};
// https server should respond all request!!
const httpsServer = https.createServer(httpsOptions, (req, res)=>{
    unifiedServer(req, res);
});

// start https server and listen port
httpsServer.listen(config.httpsPort, () => {
    console.log(`server listenining at ${config.httpsPort} ${config.envName}!!`);
});



// routes
const routes = {
    'user': handlers.userHandler,
    'cart': handlers.cartHandler
};


// all server req and res logic -- http and https
const unifiedServer = (req, res) => {
    // get URL and parse it!!
    const parseUrl = url.parse(req.url, true);
    // get path
    const pathRaw = parseUrl.pathname;
    const trimmedPath = pathRaw.replace(/^\/+|\/+$/g, '');
    // get the HTTP method
    const method = req.method.toLowerCase();
    // get query string object
    const queryStringObject = parseUrl.query;
    // get the request headers
    const headers = req.headers;
    // get payload if any using string decoder
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', data => {
        buffer += decoder.write(data);
    });
    req.on('end', () => {
        buffer += decoder.end();
        console.log(headers);
        console.log(typeof(handlers[trimmedPath]));
        console.log(typeof(handlers[trimmedPath]) != undefined);
        // choose handler for specific path, if not found return not found handler
        const chooseHandler = typeof(handlers[trimmedPath]) !== 'undefined' ? handlers[trimmedPath] : handlers.notFound;
        console.log(chooseHandler);
        const data = {
            trimmedPath,
            queryStringObject,
            method,
            headers,
            payload: buffer
        };

        chooseHandler(data, (statusCode, payload) => {
            // use status code callback handler
            const status = typeof(statusCode) === 'number' ? statusCode : 200;
            // use payload 
            payload = typeof(payload) === 'object' ? payload : {};
            const payloadString = JSON.stringify(payload);
            // return resposne 
            res.setHeader('Content-type', 'application/json');
            res.writeHead(status);
            res.end(payloadString);
        });

        // send response
        // res.end(`Request received on path: ${trimmedPath} with method ${method} -- query: ${JSON.stringify(queryStringObject)}`);
        // Log request path
        console.log(`${buffer}`);
    });
}

// openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem