module.exports = {
    name: 'Onboarding',
    query: {
        'merchant_code': {
            required: true,
            protected: true,
            type: 'string',
            source: 'merchant_code'
        }
    },
    body: {
        'finally': {
            required: true,
            type: 'NestedTest'
        }
        // 'personal_profile': {
        //     required: true,
        //     type: 'PersonalProfile'
        // },
        // 'merchant_profile': {
        //     required: true,
        //     type: 'MerchantProfile'
        // },
        // 'mother_name': {
        //     required: true,
        //     type: 'string'
        // }
    }
};
