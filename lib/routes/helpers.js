'use strict';
module.exports = (app) => {
  let Model = require('../models/models.js');
  let modules = {};

  const requestHandler = (endpoint) => {
    if (!endpoint.requestEntity || endpoint.autovalidate) {
      return (request, response, next) => {
        next();
      };
    }

    return (request, response, next) => {
      request.requestEntity = new Model(endpoint.requestEntity);
      try {
        request.requestEntity.populateRequestEntity(request.body);
        request.requestEntity.populatePathParams(request.params);
        request.requestEntity.populateQueryParams(request.query);
        request.requestEntity.throwIfErrors();
      } catch(e){
        response.status(400).json(e.message);
        return;
      }
      next();
    };
  };
  
  // TODO : 
  // REFACTOR this code with middlewares, it's redundant

  let handler = (h) => {
    let data = h.split('.');
    modules[data[0]] = modules[data[0]] || rootRequire(`${data[0]}`)(app);
    return modules[data[0]][data[1]];
  };

  const loadEndpoint = (endpoint) => {
    //let middleWaresList = middleWares(endpoint.middleWares);
    let middleWaresList = endpoint.middleWares;

    //apply all middleware
    middleWaresList.forEach(mw => {
      app.use(rootRequire('middlewares/'+mw));
    });
  
    middleWaresList = [];
    //now deal with handlers
    middleWaresList.push(handler(endpoint.handler));

    if (endpoint.requestEntity) {
      middleWaresList = [requestHandler(endpoint)].concat(middleWaresList);
    }
    console.info(`Mount ${endpoint.method} ${endpoint.path}`);

    app[endpoint.method.toLowerCase()].apply(app, [endpoint.path].concat(middleWaresList));
  };

  const createEndpoint = (path, method, via, requestEntity, handler, middleWares) => {
    return {
      path: path,
      method: method,
      via: via,
      requestEntity: requestEntity,
      handler: handler,
      middleWares: middleWares
    };
  };

  return {
    loadEndpoint: loadEndpoint,
    createEndpoint: createEndpoint
  };
};
