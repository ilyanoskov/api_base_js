module.exports.generateSwaggerFile = (app, endpointConfig, modelPath) => {
    'use strict';

    var _ = require('lodash');
    var swaggerTools = require('swagger-tools');
    var swaggerDoc = require('./swagger.json');

    endpointConfig.forEach(function (endpoint) {
        swaggerDoc.paths[endpoint.path] = {
            'x-swagger-router-controller': endpoint.handler
        };
        if (!endpoint.requestEntity) {
            swaggerDoc.paths[endpoint.path][endpoint.method] = {
                description: 'Method short description',
                operationId: "Registration",
                responses: {
                    200: {
                        description: "Success"
                    }
                }
            };
        }
        else {
            var model = rootRequire(`${modelPath}${_.snakeCase(endpoint.requestEntity)}`.toString());
            if(model.body){
                swaggerDoc.paths[endpoint.path][endpoint.method] = {
                    description: 'Method short description',
                    operationId: "action",

                    responses: {
                        200: {
                            description: "Success",
                            schema: {
                                $ref: `#/definitions/${endpoint.requestEntity}`
                            }
                        }
                    }
                };
            } else {
                swaggerDoc.paths[endpoint.path][endpoint.method] = {
                    description: 'Method short description',
                    operationId: "action",
                    responses: {
                        200: {
                            description: "Success",
                        }
                    }
                };
            }
            if (model.query) {
                if (!swaggerDoc.paths[endpoint.path][endpoint.method].parameters) {
                    swaggerDoc.paths[endpoint.path][endpoint.method].parameters = {}
                }
                for (var attributeName in model.query) {
                    if (!swaggerDoc.paths[endpoint.path][endpoint.method].parameters[attributeName]) {
                        swaggerDoc.paths[endpoint.path][endpoint.method].parameters[attributeName] = {};
                    }
                    // swaggerDoc.paths[endpoint.path][endpoint.method].parameters["X-" + attributeName].type = model.query[attributeName].type;
                    swaggerDoc.paths[endpoint.path][endpoint.method].parameters[ attributeName].type = 'string';
                    if (model.query[attributeName].required) {
                        swaggerDoc.paths[endpoint.path][endpoint.method].parameters[ attributeName].required = true;
                    }
                }
            }
            if (!(swaggerDoc.definitions.toString().includes(model.name))) {
                if (!swaggerDoc.definitions[model.name]) {
                    swaggerDoc.definitions[model.name] = {}
                    swaggerDoc.definitions[model.name].properties = {}
                }
                if (model.body) {
                    for (let attributeName in model.body) {
                        if(model.body[attributeName].required){
                            swaggerDoc.definitions[model.name].required = []
                        }
                        if (!swaggerDoc.definitions[model.name][attributeName]) {
                            swaggerDoc.definitions[model.name].properties[ attributeName] = {};
                        }
                        // swaggerDoc.definitions[model.name].properties["X-" + attributeName].type = model.body[attributeName].type;
                        swaggerDoc.definitions[model.name].properties[attributeName].type = 'string';

                        if (model.body[attributeName].required && !(swaggerDoc.definitions[model.name].required.includes( attributeName))) {
                            swaggerDoc.definitions[model.name].required.push( attributeName);
                        }
                    }
                }
            }
        }
    });
};