global.rootRequire = function(name) {
  return require(__dirname + '/' + name);
};

module.exports = (app) => {
    const Routes = require('./lib/routes/helpers')(app);

    const defineEndpoints = (endpoints) => {
        endpoints.forEach((endpoint) => {
            Routes.loadEndpoint(endpoint);
        });
    };

    const loadModels = (models) => {

    };

    return {
        defineEndpoints : defineEndpoints
    }

};


