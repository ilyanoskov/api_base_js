'use strict';

module.exports = (res, req, next) => {
    console.log("I am a middleware LOL");
    next();
};