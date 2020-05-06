const Queue = require('../../src/models/queue')
const mongoose = require('mongoose');
const { filterObject } = require('../../src/helpers/filter')

afterAll( () => {
    mongoose.connection.close();
});

// test methods are included like globals because of Jest
test('Should return a JSON object (equals filter)', () => {
    const filter = filterObject( Queue, '{"name":"Loans"}' )
    expect(filter).toEqual({ name: "Loans" })
})

test('Should return a JSON object (like filter)', () => {
    const filter = filterObject( Queue, '{"name":"/oans/"}' )
    expect(filter).toEqual({ name: /oans/ })
})

test('Should return a JSON object ($gte filter)', () => {
    const filter = filterObject( Queue, '{"createdAt":"$gte:2020-04-05"}' )
    expect(filter).toEqual({
        createdAt: {
            $gte: "2020-04-05"
        }
    })
})
test('Should return a JSON object ($gt filter)', () => {
    const filter = filterObject( Queue, '{"createdAt":"$gt:2020-04-05"}' )
    expect(filter).toEqual({
        createdAt: {
            $gt: "2020-04-05"
        }
    })
})
test('Should return a JSON object ($lt filter)', () => {
    const filter = filterObject( Queue, '{"createdAt":"$lt:2020-04-05"}' )
    expect(filter).toEqual({
        createdAt: {
            $lt: "2020-04-05"
        }
    })
})
test('Should return a JSON object ($lte filter)', () => {
    const filter = filterObject( Queue, '{"createdAt":"$lte:2020-04-05"}' )
    expect(filter).toEqual({
        createdAt: {
            $lte: "2020-04-05"
        }
    })
})