const express = require('express')
const mongoose = require('mongoose')
const Queue = require('../models/queue')

const router = express.Router()

router.post('/queues', async (req, res) => {
    const queue = new Queue(req.body)
    try{
        await queue.save()
        res.status(201).send(queue)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/queues/:id', async (req, res) => {
    try{
        const queue = await Queue.findById(req.params.id)
        if (!queue) return res.status(404).send()
        res.send(queue)
    } catch (e){
        // Not found scenary is evaluated into the try block
        res.status(500).send(e)
    }
})

router.get('/queues', async (req, res) => {
    const sort = req.query.sort || ''
    const limit = Number(req.query.limit) || 0
    const skip = Number(req.query.skip) || 0
    
    try {
        // Sorting and pagination.
        // Skip or limit different from a number returns NaN and are being ignored.
        const queues = await Queue.find().sort(sort).skip(skip).limit(limit)
        const count = await Queue.countDocuments({}, function(err, count){
            if (err) throw new Error('Error counting documents.')
            return count // Needed to calculate the last page in pagination
        })
        
        // Meta contains all the metadata needed such as pagination
        const meta = {}
        
        // Pagination links. For testing purposes only, it'll be moved to a helper module.
        if (limit && count > limit) { // Only in this scenario pagination is needed, for now
            meta.pagination = {
                first: `/queues?sort=${sort}&limit=${limit}`,
                previous: `/queues?sort=${sort}&limit=${limit}&skip=${skip - limit > 0 ? skip - limit : 0 }`,
                next: `/queues?sort=${sort}&limit=${limit}&skip=${skip + limit}`,
                last: `/queues?sort=${sort}&limit=${limit}&skip=${Math.floor(count/limit)*limit}`,
            }
        }

        res.send({queues, meta})
    } catch (e){
        res.status(500).send(e)
    }
})

router.patch('/queues/:id', async (req, res) => {
    // Verify if the parameters sent on req.body are allowed
    const fields = Object.keys(req.body)
    const allowedFields = ['name', 'code', 'enabled']
    const isValidOperation = fields.every( update => allowedFields.includes(update))
    if(!isValidOperation) return res.status(400).send({error: "Invalid fields!"})

    const _id = req.params.id

    try {
        const queue = await Queue.findById(_id)
        if (!queue) return res.status(404).send()
        fields.forEach( field => queue[field] = req.body[field] )
        await queue.save() // findByIdAndUpdate(), is replaced by findById() and object.save(), in order to trigger the model middleware ('pre' for example, or validations)
        res.send(queue)
    } catch (e){
        res.status(500).send(e)
    }
})

router.delete('/queues/:id', async (req, res) => {
    try{
        const queue = await Queue.findOneAndDelete({_id: req.params.id})
        if (!queue) return res.status(404).send(queue)
        res.send(queue)
    } catch (e){
        res.status(500).send()
    }
})

module.exports = router