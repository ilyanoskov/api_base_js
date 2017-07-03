module.exports = [
  {
    path: '/v0.1/registrations',
    method: 'get',
    requestEntity: 'Onboarding',
    middleWares : ['onboardingMiddleware'],
    handler: 'registrations.registrations',
    via: '/v0.1/me/registerrrr/',
    autovalidate : true
  }
];