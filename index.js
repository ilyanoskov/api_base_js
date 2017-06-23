'use strict';

global.libRequire = function(name) {
  return require(__dirname + '/' + name);
};

module.exports = (app) => {
    const Routes = require('./lib/routes/helpers')(app);
    const _ = require('lodash');
    const Model = require('./lib/models/models.js');
    const generateEndpoints = require('./lib/routes/index.js').generateEndpoints;
    const swaggerTools = require('swagger-tools');
    const generateSwaggerfile = require('./lib/swagger/index.js').generateSwaggerfile;

    //generate swaggerDoc
    const swaggerDoc = generateSwaggerfile();
    console.log(swaggerDoc);
    
    //initialize swaggerUI and generate documentation
    /*
    swaggerTools.initializeMiddleware(swaggerDoc, (middleware) => {
        app.use(middleware.swaggerUi());
    });
    */


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


