'use strict';
const _ = require('lodash');
let Model = require('../models/models.js');

module.exports.generateEndpoints = (endpoints) =>  (req, res) => {
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


//api-base.endoints 
//api-base.model
//api-base.setup

