const mongoose = require('mongoose');
require('./mongoose');

const Queue = require('../models/queue');
const chalk = require('chalk');

const seedQueues = [
    { name: 'Insurances', code: 'IN' },
    { name: 'Loans', code: 'LO' },
    { name: 'Investments', code: 'Iv' },
    { name: 'Accounts', code: 'ac' },
    { name: 'Checks', code: 'CH' },
    { name: 'Credit Cards', code: 'CC' },
    { name: 'Complains', code: 'CO' },
    { name: 'Bank wires', code: 'BW' },
];

Queue.insertMany( seedQueues , (err, docs) => {
    if( err ) console.log( chalk.red( err ) );
    if( docs ) console.log( chalk.green( `${docs.length} queues successfully created.`) );
    mongoose.connection.close();
});
