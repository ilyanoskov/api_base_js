'use strict';

function registrations(req, res) {
        console.log('REGISTRATIONS!!');
        res.status(200).send('REGISTRATIONS');
};

module.exports = {
        registrations : registrations
}
