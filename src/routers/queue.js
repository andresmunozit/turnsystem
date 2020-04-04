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
    try {
        const queues = await Queue.find()
        res.send(queues)
    } catch (e){
        res.status(500).send()
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