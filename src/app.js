const express = require('express')
const queueRouter = require('./routers/queue')
require('./db/mongoose')

// Variable definitions
const app = express()
const port = process.env.PORT
const path = require('path') // Used to serve static files
const publicDirPath = path.join(__dirname, '../public') // Static assets folder

// Express configuration
app.use(express.json())
app.use(express.static(publicDirPath))
app.use(queueRouter)

// Test endpoint
app.get('/test', (req, res) => {
    res.send({message: 'Ok'})
})

// Express start to listen
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})