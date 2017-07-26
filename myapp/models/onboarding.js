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
        'nested_body': {
            required: true,
            type: 'NestedTest'
        }
    }
};
