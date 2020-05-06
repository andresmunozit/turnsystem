const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true,
        maxLenght: [64, 'The email is too long']
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        unique: false,
        maxLenght: [1000, 'The name is too long']
    },
    lastname: {
        type: String,
        required: [true, 'Lastname is required'],
        trim: true,
        unique: false,
        maxLenght: [1000, 'The lastname is too long'],
    },
    idCard: {
        type: String,
        required: [true, 'idCard is required'],
        trim: true,
        unique: true,
        maxLenght: [13, 'The idCardis too long']
    },
    queues: [{ type: Schema.Types.ObjectId , ref: 'Queue' }]
});

const User = mongoose.model( 'User', userSchema );

module.exports = User;