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
        // Validate Swagger requests
        app.use(middleware.swaggerValidator());
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

    //apply request validation middleware to specific routes
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

    const defineEndpoints = (endpoints) => {
        endpoints.forEach((endpoint) => {});
    };

    const exposeToApigateway = (endpoints) => {
        app.get('/v0.1/public-endpoints', generateEndpoints(endpoints));
    };

    return {
        defineEndpoints: defineEndpoints,
        exposeToApigateway: exposeToApigateway
    }

};