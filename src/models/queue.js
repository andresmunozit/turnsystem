const mongoose = require('mongoose')

const queueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please, specify the queue name.'],
        trim: true,
        unique: true,
        maxlength: [50, 'Queue name cannot exceed 50 characters.'],
    },
    code: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: [1, 'Queue code can have 1 or 2 characters.'],
        maxlength: [2, 'Queue code can have 1 or 2 characters.'],
    },
    enabled: {
        type: Boolean,
        default: true
    }
}, {timestamps: true} )

// Turn all code string characters to uppercase
queueSchema.pre('save', function(next) {
    const queue = this
    queue.code = queue.code.toUpperCase()
    next()
})

const Queue = mongoose.model('Queue', queueSchema)

module.exports = Queue