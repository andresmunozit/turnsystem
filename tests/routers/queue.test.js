const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../../src/app')
const Queue = require('../../src/models/queue')

// Create some dummy data
const testQueues = [
    {_id: mongoose.Types.ObjectId('000000000000000000000001'), name: "Loans", code: 'LO'},
    {_id: mongoose.Types.ObjectId('000000000000000000000002'), name: "Insurances", code: 'IS'}
]

// Empty the Queues collection and create some dummy data before testing
beforeEach( async () => {
    await Queue.deleteMany()
    testQueues.forEach( async testQueue => {
        const queue = new Queue(testQueue)
        await queue.save()
    })
})

// Test cases
test ('Should create a new Queue', async () => {
    await request(app).post('/queues').send({
        name: 'Investments',
        code: 'IN'
    }).expect(201)
})