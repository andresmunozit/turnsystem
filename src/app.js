const path = require('path') // Used to serve static files
const express = require('express')
const mongoose = require('mongoose') // This require must be deleted once the models were moved to a separated directory
require('./db/mongoose')

// Variable definitions
const app = express()
const port = process.env.PORT || 3000
const publicDirPath = path.join(__dirname, '../public') // Static assets folder

// Express configuration
app.use(express.json())
app.use( express.static(publicDirPath))

// Test endpoint
app.get('/test', (req, res) => {
    res.send({message: 'Ok'})
})

// Queue model (testing purposes only, will be moved to models directory)
const queueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    }, 
    code: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    enabled: {
        type: Boolean,
        default: true
    }
}, {timestamps: true})

const Queue = mongoose.model('Queue', queueSchema)

// CRUD Queue endpoints (testing purposes only, will be moved to routers directory)
app.post('/queues', async (req, res) => {
    const queue = new Queue(req.body)
    try{
        await queue.save()
        res.status(201).send(queue)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Read one (testing purposes only, will be moved to routers directory)
app.get('/queues/:id', async (req, res) => {
    try{
        const queue = await Queue.findById(req.params.id)
        if (!queue) return res.status(404).send()
        res.send(queue)
    } catch (e){
        // Not found scenary is evaluated into the try block
        res.status(500).send(e)
    }
})

// Read queues (testing purposes only, will be moved to routers directory)
app.get('/queues', async (req, res) => {
    try {
        const queues = await Queue.find()
        res.send(queues)
    } catch (e){
        res.status(500).send()
    }
})

// Update a queue (testing purposes only, will be moved to routers directory)
app.patch('/queues/:id', async (req, res) => {
    const fields = Object.keys(req.body)
    const allowedFields = ['name', 'code', 'enabled']
    const isValidOperation = fields.every( update => allowedFields.includes(update))
    if(!isValidOperation) return res.status(400).send({error: "Invalid fields!"})

    const _id = req.params.id

    try {
        const queue = await Queue.findByIdAndUpdate({_id}, req.body,{new: true}) // new option returns the updated object
        if (!queue) return res.status(404).send()
        res.send(queue)
    } catch (e){
        res.status(500).send()
    }
})

// Delete a queue (testing purposes only)
app.delete('/queues/:id', async (req, res) => {
    try{
        const queue = await Queue.findOneAndDelete({_id: req.params.id})
        if (!queue) return res.status(404).send(queue)
        res.send(queue)
    } catch (e){
        res.status(500).send()
    }
})

// Express start to listen
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})