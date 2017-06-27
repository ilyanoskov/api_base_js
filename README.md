# Api Base for NodeJS

The goal of this library is to provide a simple approach to develop complex APIs in declarative way.
Fill your endpoints.js file, add custom models and controllers and you are set! The library will automatically 
generate Swagger documentation at the `/api-docs` endpoint. Enjoy!

## Installation

Run `npm install` inside api_base_js folder
Run `npm install` inside myapp folder
After that, run `node index` to have the sample application running

## Usage

```
const options = {
  //controllers folder:
  controllers : './handlers',
  //middleware folder:
  middleware : './middleware',
  //endpoints file
  endpoints : './endpoints.js'
};

const api_base = require('api_base_js')(app, options);

```

the endpoints.js file :

```
module.exports = [
  {
    path: '/registrations',
    method: 'post',
    requestEntity: 'onboarding',
    middleWares : ['onboardingMiddleware'],
    handler: 'registrations.js',
    via: '/v0.1/me/registrations',
    autovalidate : false
  },
  {
    path: '/test',
    method: 'get',
    handler: 'test.js',
    via: '/v0.1/me/test',
    autovalidate : true
  }
];

```



