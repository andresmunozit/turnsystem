const mongoose = require('mongoose');
const chalk = require('chalk');

require('./mongoose');
const Queue = require('../models/queue');
const User = require('../models/user')

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

const seedUsers = [
    {
        email: 'Lottie.Koss@yahoo.com',
        name: 'Deondre',
        lastname: 'Hansen',
        idCard: '19833',
    },
    {
        email: 'Kayley16@yahoo.com',
        name: 'Andy',
        lastname: 'Brown',
        idCard: '46367',
    },
    {
        email: 'Giovanny87@hotmail.com',
        name: 'Arely',
        lastname: 'Medhurst',
        idCard: '80017',
    },
    {
        email: 'Lilliana33@hotmail.com',
        name: 'Daija',
        lastname: 'Brakus',
        idCard: '56031',
    },
];

User.insertMany( seedUsers, (err, docs) => {
    if(err) return console.log(chalk.red(err));
    if(docs) return console.log(chalk.green(`${docs.length} users successfully created`))
    mongoose.connection.close();
});
