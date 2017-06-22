'use strict';
module.exports = (app) => {
  console.log(__filename);
  let Model = require('/Users/ilyanoskov/practice/js/api_base_js/lib/models/models.js');
  let modules = {};

  const requestHandler = (endpoint) => {
    //Don't validate if autovalidate or no requestEntity
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

  let handler = (h) => {
    let rootPath = '../../../';
    let data = h.split('.');
    modules[data[0]] = modules[data[0]] || require(`${rootPath}${data[0]}`)(app);
    return modules[data[0]][data[1]];
  };

  const middleWares = (list) => {
    let result = [];

    (list || []).forEach((mw) => {
      result.push(handler(mw));
    });

    return result;
  };

  const loadEndpoint = (endpoint) => {
    let middleWaresList = middleWares(endpoint.middleWares);
    middleWaresList.push(handler(endpoint.handler));
    console.log(middleWaresList);

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
