'use strict';
let _ = require('lodash');
let MissingParamError=rootRequire('lib/models/errors/missing_param_error.js');
let InvalidValueError = rootRequire('lib/models/errors/invalid_value_error.js');
let MultipleError=rootRequire('lib/models/errors/multiple_error.js');

module.exports = class Model {
    constructor(modelName) {
        let _this = this;
        this.modelName = modelName;
        // TODO : add custom addresses for models
        this._scheme = rootRequire(`models/${_.snakeCase(this.modelName)}`);
        _this.validationErrors = [];
    }

    populateRequestEntity(data) {
        this.populate(data, 'body');
    }

    populatePathParams(data) {
        this.populate(data, 'path');
    }

    populateQueryParams(data) {
        this.populate(data, 'query');
    }

    populate(data, type) {
        let _this = this;
        _.keys(this._scheme[type]).forEach(function(key) {
            _.set(_this, `${type}.${key}`, _.get(data, key, null));
        });
        _this.validate(this._scheme[type], _this[type]);
    }

    typedValue(value, type) {
        if (type === 'date') {
            return new Date(value);
        }
        return value;
    }

    throwIfErrors() {
        if (this.validationErrors.length > 0) {
            throw new MultipleError(this.validationErrors);
        }
    }

    validate(fieldsDef, self) {
      let _this = this;

      _.keys(fieldsDef).forEach(function(key) {
        //validation of REQUIRED
        let required = fieldsDef[key].required;
        let type = fieldsDef[key].type;
        let value = _this.typedValue(_.get(self, key), type);
        let values = fieldsDef[key].values;

          /* Check first that the required parameters exists */

        if (required && typeof required === 'boolean' &&
            (_.isUndefined(self, key) || _.isNull(_.get(self, key)))) {
          _this.validationErrors.push(new MissingParamError(key));
        }

          /* Check each parameter's value against type */

        if (value !== null) { /* null is asigned to not required value */
          if (type === 'string' && typeof value !== 'string') {
            _this.validationErrors.push(new InvalidValueError(key));
          }

          if (type === 'boolean' && typeof value !== 'boolean') {
            _this.validationErrors.push(new InvalidValueError(key));
          }

          if (type === 'date' && typeof value !== 'object' && !(value instanceof Date)) {
            _this.validationErrors.push(new InvalidValueError(key));
          }
        }

        if (values && values.indexOf(value) < 0) {
          _this.validationErrors.push(new InvalidValueError(key));
        }
      });

      return true;
    }

};

