'use strict';

let _ = require('lodash');


module.exports.generateSwaggerFile = (app, endpointConfig, modelPath, options) => {

    const arrayType = 'array';

    //Parse nested array types recursively (array, primitive types, objects)
    const setNestedArrayDefinition = (model, swaggerDoc, primitiveTypes, path, arrType) => {
        let nestedType = _.get(model, arrType + `.type`);

        if (nestedType === arrayType){

            _.set(swaggerDoc, `${path}.type`, nestedType);
            _.set(swaggerDoc, `${path}.items`, {});

            setNestedArrayDefinition(model, swaggerDoc, primitiveTypes, path + `.items`, arrType + '.items');

            return arrayType;

        } else if (!primitiveTypes.includes(nestedType)) {

            _.set(swaggerDoc, `${path}.$ref`, `#/definitions/${nestedType}`);

            if (nestedType) {

                let defModel = rootRequire(`${modelPath}${_.snakeCase(nestedType)}`.toString());
                createDefinitions(swaggerDoc, defModel);

            }
            return arrayType;
        }
        _.set(swaggerDoc, `${path}.type`, `${nestedType}`);

        return arrayType;
    }

    //Set definitions based on the type of the model provided
    const setDefinitionType = (model, type, attributeName, swaggerDoc) => {
        let primitiveTypes = ['integer', 'string', 'number', 'boolean'];

        if (primitiveTypes.includes(type)) {
            return type;
        }

        if (type === arrayType) {

            let itemsPath = `definitions.${model.name}.properties.${attributeName}.items`;
            let modelItemPath = `body.${attributeName}.items`;

            return setNestedArrayDefinition(model, swaggerDoc, primitiveTypes, itemsPath, modelItemPath)

        } else {

            let defModel = rootRequire(`${modelPath}${_.snakeCase(type)}`.toString());

            createDefinitions(swaggerDoc, defModel);

            swaggerDoc.definitions[model.name].properties[attributeName] = {
                $ref: `#/definitions/${type}`
            };

            return 'object';
        }
    }

    //Adds response definition of the response model specified in endpoints.js.response. Response model location models/responses/..
    const createResponseDef = (swaggerDoc, endpoint, handler) => {
        let responseModel = rootRequire(`${modelPath}responses/${_.snakeCase(endpoint.response)}`.toString());
        swaggerDoc.paths[endpoint.path][endpoint.method] = {
            description: `via: ${endpoint.via}`,
            operationId: handler[1],
            responses: {
                'x-handler_address': `Handler: ${endpoint.handler}`
            }
        };
        swaggerDoc.paths[endpoint.path][endpoint.method].responses[responseModel.code] = {};
        swaggerDoc.paths[endpoint.path][endpoint.method].responses[responseModel.code].description = responseModel.description;
        if (endpoint.response) {
            swaggerDoc.paths[endpoint.path][endpoint.method].responses[responseModel.code].schema = {$ref: `#/definitions/${endpoint.response}`}
        }
    }

    //Parses the custom models to swagger compliant definitions.
    const createDefinitions = (swaggerDoc, model) => {
        for (var key in swaggerDoc.definitions) {
            if (key === (model.name)) {
                return
            }
        }

        if (!swaggerDoc.definitions[model.name]) {
            swaggerDoc.definitions[model.name] = {};
            swaggerDoc.definitions[model.name].type = 'object';
            swaggerDoc.definitions[model.name].properties = {};
        }
        if (model.body) {
            for (let attributeName in model.body) {
                if (!swaggerDoc.definitions[model.name][attributeName]) {
                    swaggerDoc.definitions[model.name].properties[attributeName] = {};
                }
                let type = model.body[attributeName].type;
                swaggerDoc.definitions[model.name].properties[attributeName].type = setDefinitionType(model, type, attributeName, swaggerDoc);

                if (model.body[attributeName].required && (!(swaggerDoc.definitions.toString().includes(model.name)))) {
                    swaggerDoc.definitions[model.name].required = []
                }
                if (model.body[attributeName].required && !(swaggerDoc.definitions[model.name].required.includes(attributeName))) {
                    swaggerDoc.definitions[model.name].required.push(attributeName);
                }
            }
        }

    }

    //Adds custom query parameters from requestEntity model
    const populateQueryParams = (model, swaggerDoc, endpoint) => {
        for (var attributeName in model.query) {
            if (!swaggerDoc.paths[endpoint.path][endpoint.method].parameters[attributeName]) {
                let parameter = {};
                if (model.query[attributeName].protected) {
                    _.set(parameter, 'x-protected', model.query[attributeName].protected);
                }
                if (model.query[attributeName].source) {
                    _.set(parameter, 'x-source', model.query[attributeName].source);
                }

                let type = model.query[attributeName].type;

                _.set(parameter, 'name', attributeName);
                _.set(parameter, 'in', 'query');
                _.set(parameter, 'type', model.query[attributeName].type);
                _.set(parameter, 'required', model.query[attributeName].required);

                swaggerDoc.paths[endpoint.path][endpoint.method].parameters.push(parameter);

            }
        }
    }

    //Adds the swagger definitions from the requestEntity body properties
    const populateBodyParams = (swaggerDoc, endpoint) => {
        swaggerDoc.paths[endpoint.path][endpoint.method].parameters.push({
            name: 'body parameters',
            in: 'body',
            schema: {
                $ref: `#/definitions/${endpoint.requestEntity}`
            }
        });
    }

    let swaggerDoc = { swagger: "2.0" };
    _.set(swaggerDoc, "info.title", options.swagger.title);
    _.set(swaggerDoc, "info.description", options.swagger.description);
    _.set(swaggerDoc, "info.version", options.swagger.version);
    _.set(swaggerDoc, "produces", ["application/json"]);
    _.set(swaggerDoc, "host", `${options.connection.host}:${options.connection.port}`);
    _.set(swaggerDoc, "paths", {});
    _.set(swaggerDoc, "definitions", {});

    endpointConfig.forEach(function (endpoint) {
        let handler = endpoint.handler.split('.');
        swaggerDoc.paths[endpoint.path] = {
            'x-swagger-router-controller': handler[0]
        };

        createResponseDef(swaggerDoc, endpoint, handler);

        if (endpoint.requestEntity) {
            let model = rootRequire(`${modelPath}${_.snakeCase(endpoint.requestEntity)}`.toString());

            if (!swaggerDoc.paths[endpoint.path][endpoint.method].parameters) {
                swaggerDoc.paths[endpoint.path][endpoint.method].parameters = []
            }

            if (model.body) {
                swaggerDoc.paths[endpoint.path][endpoint.method].responses['200'].schema = {$ref: `#/definitions/${endpoint.response}`}
                populateBodyParams(swaggerDoc, endpoint);
            }
            if (model.query) {
                populateQueryParams(model, swaggerDoc, endpoint);
            }
            createDefinitions(swaggerDoc, model);
        }

        if (endpoint.response){
            let responseModel = rootRequire(`${modelPath}responses/${_.snakeCase(endpoint.response)}`.toString());
            createDefinitions(swaggerDoc, responseModel);
        }
    });

    return swaggerDoc;
};
