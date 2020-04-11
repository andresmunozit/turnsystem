const express = require('express')
const mongoose = require('mongoose')
const Queue = require('../models/queue')
const { filterObject } = require('../helpers/filter')

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

router.get('/queues(||.json)', async (req, res) => {
    const sort = req.query.sort || '' // Default sort field is creation data
    const limit = Math.abs(Math.floor(Number(req.query.limit))) || 5
    const skip = Math.abs(Math.floor(Number(req.query.skip))) || 0
    
    try {
        const filter = filterObject(Queue, req.query.filter)
        // Sorting and pagination.
        // Skip or limit different from a number returns NaN and are being ignored.
        const queues = await Queue.find(filter).sort(sort).skip(skip).limit(limit)
        const count = await Queue.countDocuments(filter, function(err, count){
            if (err) throw {error: 'Error counting registers.'}
            return count // Needed to calculate the last page in pagination
        })
        
        // Meta contains all the metadata needed such as pagination
        const meta = {}
        
        // Pagination links. For testing purposes only, it'll be moved to a helper module.
        if (limit && count > limit) { // Only in this scenario pagination is needed
            meta.pagination = {}
            if (skip > 0){
                meta.pagination.first = `${req.path}?sort=${sort}&limit=${limit}`
                meta.pagination.previous = `${req.path}?sort=${sort}&limit=${limit}&skip=${skip - limit > 0 ? skip - limit : 0 }`
            }
            if (count - skip > limit){
                meta.pagination.next = `${req.path}?sort=${sort}&limit=${limit}&skip=${skip + limit}`
                meta.pagination.last = `${req.path}?sort=${sort}&limit=${limit}&skip=${Math.floor(count/limit)*limit}`
            }
        }
       
        // Depending on the path, JSON or HTML
        if (req.path.match(/\.json/)) {
            res.send({queues, meta})
        } else {
            res.render('views/queues',{queues, meta})
        }
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