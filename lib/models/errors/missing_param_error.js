'use strict';

let ValidationError = libRequire('lib/models/errors/validation_error.js');

module.exports = class MissingParamError extends ValidationError {

    constructor(field) {
        super('MISSING', field);
    }
};
