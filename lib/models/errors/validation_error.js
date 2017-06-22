'use strict';

module.exports = class ValidationError extends Error {
    constructor(errorCode, field) {
        super('Validation error');
        this._message = 'Validation error';
        this.errorCode = errorCode;
        this.field = field;
        Object.defineProperty(this, 'name', {
          enumerable : false,
          value : this.constructor.name
        });
        Object.defineProperty(this, 'message', {
          enumerable : false,
          writable: true,
          value : {message: this._message,
            error_code: this.errorCode,
            param: this.field,
            status_code: 400}
        });
    }
};