'use strict';
global.rootRequire = function(name) {
  return require(__dirname + '/' + name);
};

module.exports = (app) => {
    const Routes = require('./lib/routes/helpers')(app);
    let _ = require('lodash');
    let Model = require('./lib/models/models.js');
    let generateEndpoints = require('./lib/routes/index.js').generateEndpoints;

    const defineEndpoints = (endpoints) => {
        endpoints.forEach((endpoint) => {
            Routes.loadEndpoint(endpoint);
        });
    };
    const exposeToApigateway = (endpoints) => {
        app.get('/v0.1/public-endpoints', generateEndpoints(endpoints)); 
    };

    const generateDocumentation = (endpoints) => {
           
    };

    return {
        defineEndpoints : defineEndpoints,
        exposeToApigateway : exposeToApigateway
    }

};


