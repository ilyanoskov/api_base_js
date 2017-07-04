module.exports = {
    name: 'NestedTest',
    body: {
        'works': {
            required: true,
            type: 'string'
        },
        'Custom': {
            required: true,
            type: 'array',
            items: {
                type: 'Email'
            }
        }
    }
};
