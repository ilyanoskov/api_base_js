'use strict';
global.rootRequire = function(name) {
  return require(__dirname + '/' + name);
};

module.exports = (app) => {
    const Routes = require('./lib/routes/helpers')(app);
    let _ = require('lodash');
    let Model = require('/Users/ilyanoskov/practice/js/api_base_js/lib/models/models.js');
    let generateEndpoints = require('/Users/ilyanoskov/practice/js/api_base_js/lib/routes/index.js').generateEndpoints;

    const defineEndpoints = (endpoints) => {
        endpoints.forEach((endpoint) => {
            Routes.loadEndpoint(endpoint);
        });
    };
/*
    const generateEndpoints = (endpoints) =>  (req, res) => {
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
    } 

*/

    const exposeToApigateway = (endpoints) => {
        app.get('/v0.1/public-endpoints', generateEndpoints(endpoints)); 
    };

    return {
        defineEndpoints : defineEndpoints,
        exposeToApigateway : exposeToApigateway
    }

};


