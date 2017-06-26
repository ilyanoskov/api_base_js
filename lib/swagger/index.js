'use strict';
//main file that parses all API's 
//into swagger-compatible documentation
const _ = require('lodash');

module.exports.generateSwaggerfile = () => {
    let swaggerfile = {
        swagger: "2.0"
    };

    let endpoints = rootRequire('endpoints.js'); //TODO: add from config
    let p = rootRequire('package.json');
    //generate header data from package.json
    swaggerfile.info = {
        title: p.name,
        description: p.description,
        version: "v0.1"
    }

    swaggerfile.produces = ["application/json"];
    swaggerfile.host = "localhost:3000"; // TODO: add from config 

    swaggerfile.paths = {};
    endpoints.forEach(endpoint => {

        //all path manipulation goes here
        //_.set(swaggerfile, `paths.${endpoint.path}`, 'alabala')
        swaggerfile.paths[endpoint.path] = {};
        swaggerfile.paths[endpoint.path][endpoint.method] = {
            parameters: [{
                name: "location",
                in: "body",
                schema: {
              "$ref": "#/definitions/location"
            }
            }]
        };
        swaggerfile.paths[endpoint.path][endpoint.method].responses = {
            200: {
                description: "all good"
            }
        };

        //definitions (or models)
        swaggerfile.definitions = {};
        if (endpoint.requestEntity) {
            let requestEntity = _.lowerCase(endpoint.requestEntity);
            let model = rootRequire(`models/${requestEntity}`);
            swaggerfile.definitions[model.name] = {};
            //swaggerfile.definitions[model.name].required = ["yolo"];
            for (let attributeName in model.body) {
                if (attributeName.required) {
                    swaggerfile.definitions[model.name].required.push(attributeName);
                }
            }
            swaggerfile.definitions[model.name].type = "string";

            swaggerfile.definitions = {
                location: {
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string"
                        },
                        "zipcode": {
                            "type": "string"
                        },
                        "lat": {
                            "type": "string"
                        },
                        "long": {
                            "type": "string"
                        },
                        "timezone": {
                            "type": "string",
                            "x-sumup" : "string"
                        },
                        "alert": {
                            "type": "string"
                        },
                        "degreetype": {
                            "type": "string",
                            "enum": ["C", "F"]
                        },
                        "imagerelativeurl": {
                            "type": "string"
                        }
                    },
                    "required": ["name", "lat", "long", "timezone", "degreetype"]
                }
            }
        }
    })

    return swaggerfile;
}