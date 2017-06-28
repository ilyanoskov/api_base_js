'use strict';
module.exports = (app) => {
    const reg = (req, res, next) => {
        console.log('REGISTRATIONS!!');
        res.send('REGISTRATIONS');
    };
        return {
            reg : reg
        };
}; 
