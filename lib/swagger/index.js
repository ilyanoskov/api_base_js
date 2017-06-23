'use strict';
//main file that parses all API's 
//into swagger-compatible documentation

module.exports.generateSwaggerfile = () => {
    let swaggerfile = {
        swagger: 2
    };

    //let endpoints = require('endpoints.js'); //TODO: add from config
    let p = rootRequire('package.json');
    //generate header data from package.json
    swaggerfile.info = {
        title: p.name,
        description: p.description,
        version: p.version
    }

    swaggerfile.produces = ["application/json"];
    swaggerfile.host = "localhost:3000"; // TODO: add from config 
    swaggerfile.basepath = "/v0.1";

    /*
    endpoints.forEach((endpoint) => {
        let j = {};
        let p = endpoint.path;
        swaggerfile[endpoint.path] = {
            j[endpoint.method] = {
                operationId:: endpoint.handler,
                tags: [],
                description: "",
                parameters: []
            }
        };
    });
    */

    return swaggerfile;
}