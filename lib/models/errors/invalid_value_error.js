'use strict';

let ValidationError = libRequire('lib/models/errors/validation_error.js');

module.exports = class InvalidValueError extends ValidationError {

    constructor(field) {
        super('INVALID_VALUE', field);
    }
};
