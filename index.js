'use strict';

//rootRequire for the library
global.libRequire = function(name) {
  return require(__dirname + '/' + name);
};

module.exports = (app, options) => {
    const Routes = require('./lib/routes/helpers')(app);
    const _ = require('lodash');
    const Model = require('./lib/models/models.js');
    const generateEndpoints = require('./lib/routes/index.js').generateEndpoints;
    const swaggerTools = require('swagger-tools');
    const generateSwaggerfile = require('./lib/swagger/index.js').generateSwaggerFile;
    const endpoints = rootRequire('./endpoints.js')

    //generate swaggerDoc
    generateSwaggerfile(app, endpoints, 'models/');
    var swaggerDoc = require('./lib/swagger/swagger.json')
        //const swaggerDoc = rootRequire(options.swaggerDoc);
    
    //initialize swaggerUI and generate documentation
    swaggerTools.initializeMiddleware(swaggerDoc, (middleware) => {
        // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
        app.use(middleware.swaggerMetadata());

        // Validate Swagger requests
        app.use(middleware.swaggerValidator());

        // Route validated requests to appropriate controller
        app.use(middleware.swaggerRouter(options));

        // serve documentation on /docs
        app.use(middleware.swaggerUi());
    });


    //initialize our own middlewares for specific routes
    // BLAH BLAH BLAH

    const defineEndpoints = (endpoints) => {
        endpoints.forEach((endpoint) => {
            Routes.loadEndpoint(endpoint);
        });
    };

    const exposeToApigateway = (endpoints) => {
        app.get('/v0.1/public-endpoints', generateEndpoints(endpoints)); 
    };

    return {
        defineEndpoints : defineEndpoints,
        exposeToApigateway : exposeToApigateway
    }

};


