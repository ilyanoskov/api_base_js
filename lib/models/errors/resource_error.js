'use strict';

module.exports = class ResourceError extends Error {
  constructor(errorCode, message, statusCode) {
    super(message);
    this._message = message;
    this._errorCode = errorCode;
    this._statusCode = statusCode;
    console.log(this._message);
    console.log(this._statusCode);
    Object.defineProperty(this, 'name', {
      enumerable: false,
      value: this.constructor.name
    });
    Object.defineProperty(this, 'message', {
      enumerable: false,
      writable: true,
      value: {
        message: this._message,
        error_code: this._errorCode,
        status_code: this._statusCode
      }
    });
  }
};