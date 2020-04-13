const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../../src/app')
const Queue = require('../../src/models/queue')

// Create some dummy data
const queueOneId = mongoose.Types.ObjectId()
const queueTwoId = mongoose.Types.ObjectId()
const queueThreeId = mongoose.Types.ObjectId()

const testQueues = [
    {_id: queueOneId, name: "Loans", code: 'LO'},
    {_id: queueTwoId, name: "Insurances", code: 'IS'}
]

// Empty the Queues collection and create some dummy data before testing
beforeEach( async () => {
    await Queue.deleteMany()

    const queueOne = new Queue(testQueues[0])
    await queueOne.save()

    const queueTwo = new Queue(testQueues[1])
    await queueTwo.save()
})

// Test cases
test ('Should create a new Queue', async () => {
    await request(app)
        .post('/queues')
        .send({
            name: 'Investments',
            code: 'IN'
        })
        .expect(201)
})

test ('Should not create a new Queue (code too long)', async () => {
    await request(app)
        .post('/queues')
        .send({
            name: 'Investments',
            code: 'INVV'
        })
        .expect(400)
})

test ('Should not create a new Queue (name too long)', async () => {
    await request(app)
        .post('/queues')
        .send({
            name: 'Investments 123456789012345678901234567890123456789012345678901234567890',
            code: 'IN'
        })
        .expect(400)
})

test ('Should not create a new Queue (name doesn\'t exist)', async () => {
    await request(app)
        .post('/queues')
        .send({
            code: 'IN'
        })
        .expect(400)
})

test ('Should not create a new Queue (code doesn\'t exist)', async () => {
    await request(app)
        .post('/queues')
        .send({
            name: 'Investments'
        })
        .expect(400)
})

test ('Should not create a new Queue (name already exist)', async () => {
    await request(app)
        .post('/queues')
        .send({
            name: 'Loans',
            name: 'LO'
        })
        .expect(400)
})

test ('Should not create a new Queue (code already exist)', async () => {
    await request(app)
        .post('/queues')
        .send({
            name: 'Insurances 2',
            name: 'IS'
        })
        .expect(400)
})

test('Should read many queues', async () => {
    await request(app)
        .get('/queues')
        .expect(200)
})

test('Should read one queue', async () => {
    await request(app)
        .get(`/queues/${queueOneId}`)
        .expect(200)
})

test('Should update one queue', async () => {
    await request(app)
        .patch(`/queues/${queueOneId}`)
        .send({
            enabled: false
        })
        .expect(200)
})

test('Shouldn\'t update one queue (name already exists)', async () => {
    await request(app)
        .patch(`/queues/${queueOneId}`)
        .send({
            name: "Insurances"
        })
        .expect(500)
})

test('Shouldn\'t update one queue (code already exists)', async () => {
    await request(app)
        .patch(`/queues/${queueOneId}`)
        .send({
            code: "IS"
        })
        .expect(500)
})

test ('Should delete a Queue', async () => {
    await request(app)
        .delete(`/queues/${queueOneId}`)
        .expect(200)
})

test ('Shouldn\'t delete a Queue (not found)', async () => {
    await request(app)
        .delete(`/queues/${queueThreeId}`)
        .expect(404)
})