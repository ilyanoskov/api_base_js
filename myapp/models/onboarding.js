module.exports = {
  name: 'Onboarding',
  body: {
    'email': {
      required: false,
      type: 'email'
    },
    'personal_profile': {
      required: false,
      type: 'PersonalProfile'
    },
    'merchant_profile': {
      required: true,
      type: 'MerchantProfile'
    },
    'mother_name': {
      required: false,
      type: 'string'
    }
  }
};
