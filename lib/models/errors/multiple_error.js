'use strict';
let _ = require('lodash');

module.exports = class MultipleError extends Error {

    constructor(errors) {
        super('Multiple errors');
        this._message = 'Multiple errors';
        Object.defineProperty(this, 'name', {
          enumerable : false,
          value : this.constructor.name
        });
        Object.defineProperty(this, 'message', {
          enumerable : false,
          writable: true//,
          //value : _.pluck(errors, 'message')
        });
    }
}