'use strict';

//rootRequire for the library
global.libRequire = function (name) {
    return require(__dirname + '/' + name);
};

module.exports = (app, options) => {
    const _ = require('lodash');
    const Model = require('./lib/models/models.js');
    const generateEndpoints = require('./lib/routes/index.js').generateEndpoints;
    const swaggerTools = require('swagger-tools');
    const generateSwaggerfile = require('./lib/swagger/index.js').generateSwaggerFile;
    const endpoints = rootRequire('./endpoints.js')

    //generate swaggerDoc
    generateSwaggerfile(app, endpoints, 'models/');
    var swaggerDoc = require('./lib/swagger/swagger.json');
    console.log(swaggerDoc);
    //const swaggerDoc = rootRequire(options.swaggerDoc);

    //initialize swaggerUI and generate documentation
    swaggerTools.initializeMiddleware(swaggerDoc, (middleware) => {
        // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
        app.use(middleware.swaggerMetadata());
        // Route validated requests to appropriate controller
        app.use(middleware.swaggerRouter({
            controllers: options.controllers
        }));
        // serve documentation on /docs
        app.use(middleware.swaggerUi());
    });


    //initialize our own middlewares for specific routes
    endpoints.forEach(endpoint => {
        if (!_.isEmpty(endpoint.middleWares)) {
            endpoint.middleWares.forEach(mw => {
                app.use(endpoint.path, rootRequire(options.middleware + '/' + mw));
            })
        }
    });

    //apply request validation to specific routes
    endpoints.forEach(endpoint => {
        if (!endpoint.autovalidate && endpoint.requestEntity) {
            app.use(endpoint.path, (req, res, next) => {
                req.requestEntity = new Model(endpoint.requestEntity);
                try {
                    req.requestEntity.populateRequestEntity(req.body);
                    req.requestEntity.populatePathParams(req.params);
                    req.requestEntity.populateQueryParams(req.query);
                    req.requestEntity.throwIfErrors();
                } catch (e) {
                    res.status(400).json(e.message);
                    return;
                }
                next();
            });
        }
    });


    const exposeToApigateway = (endpoints) => {
        app.get('/v0.1/public-endpoints', (req, res, next) => {
        let result = {};
        endpoints.forEach((endpoint) => {
            if (endpoint.via) {
                result[endpoint.via] = result[endpoint.via] || [];
                let entry = {
                    uri: endpoint.path,
                    method: endpoint.method,
                    protected_params: [],
                    params: []
                };
                if (endpoint.requestEntity) {
                    let model = new Model(endpoint.requestEntity);

                    _.mapKeys(model._scheme.query || {}, function(param, key) {
                        let paramEntry = {
                            name: key,
                            type: 'query'
                        };
                        if (param.source) {
                            paramEntry.source = param.source;
                        }
                        entry.params.push(paramEntry);
                        if (param.protected) {
                            entry.protected_params.push(paramEntry);
                        }
                    });

                    _.mapKeys(model._scheme.path || {}, function(param, key) {
                        let paramEntry = {
                            name: key,
                            type: 'path'
                        };
                        entry.params.push(paramEntry);
                        if (param.protected) {
                            entry.protected_params.push(paramEntry);
                        }
                    });
                }

                result[endpoint.via].push(entry);
            }
        });

        res.json(result); 
    } ) } ;

    //serve endpoints for apigateway
    exposeToApigateway(endpoints);

    return {
        exposeToApigateway: exposeToApigateway
    }

};