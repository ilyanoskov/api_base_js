'use strict';
module.exports = (app) => (req, res, next) => {
        console.log('TEST!!');
        res.status(200).send('TEST');
}; 

