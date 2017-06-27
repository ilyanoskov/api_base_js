module.exports = [
  {
    path: '/v0.1/registrations',
    method: 'put',
    requestEntity: 'Onboarding',
    middleWares : ['onboardingMiddleware'],
    handler: 'handlers/registrations.reg',
    via: '/v0.1/me/registerrrr/',
    autovalidate : true
  }
];