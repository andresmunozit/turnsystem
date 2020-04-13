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

test ('Should not create a new Queue (code too long)', async () => {
    const serverResponse = await request(app).post('/queues').send({
        name: 'Investments',
        code: 'INVV'
    }).expect(400)
})
test ('Should not create a new Queue (name too long)', async () => {
    const serverResponse = await request(app).post('/queues').send({
        name: 'Investments 123456789012345678901234567890123456789012345678901234567890',
        code: 'IN'
    }).expect(400)
})
test ('Should not create a new Queue (name doesn\'t exist)', async () => {
    const serverResponse = await request(app).post('/queues').send({
        code: 'IN'
    }).expect(400)
})
test ('Should not create a new Queue (code doesn\'t exist)', async () => {
    const serverResponse = await request(app).post('/queues').send({
        name: 'Investments'
    }).expect(400)
})
test ('Should not create a new Queue (name already exist)', async () => {
    const serverResponse = await request(app).post('/queues').send({
        name: 'Loans',
        name: 'LO'
    }).expect(400)
})
test ('Should not create a new Queue (code already exist)', async () => {
    const serverResponse = await request(app).post('/queues').send({
        name: 'Insurances 2',
        name: 'IS'
    }).expect(400)
})

test('Should read many queues', async () => {
    const serverResponse = await request(app).get('/queues').expect(200)
})
test('Should read one queue', async () => {
    const serverResponse = await request(app).get('/queues/000000000000000000000001').expect(200)
})
test('Should update one queue', async () => {
    const serverResponse = await request(app).patch('/queues/000000000000000000000001').send({
        enabled: false
    }).expect(200)
})
test('Shouldn\'t update one queue (name already exists)', async () => {
    const serverResponse = await request(app).patch('/queues/000000000000000000000001').send({
        name: "Insurances"
    }).expect(500)
})
test('Shouldn\'t update one queue (code already exists)', async () => {
    const serverResponse = await request(app).patch('/queues/000000000000000000000001').send({
        code: "IS"
    }).expect(500)
})
