const express = require('express')
const hbs = require('hbs')
const queueRouter = require('./routers/queue')
require('./db/mongoose') // Mongoose configuration (connection and parameters)

// Variable definitions
const app = express()
const port = process.env.PORT
const path = require('path') // Used to serve static files
const publicDirPath = path.join(__dirname, '../public') // Static assets folder
const viewsPath = path.join(__dirname, '../views') // "views" is the default path for views in hbs, it can be changed here in the future
const partialsPath = path.join(__dirname, '../views/partials')

// Express configuration
app.use(express.json())
app.use(express.static(publicDirPath))
app.use(queueRouter)

// Hbs (Handlebars Express Plugin) configuration
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Test endpoint
app.get('/test', (req, res) => {
    res.send({message: 'Ok'})
})

// Express start to listen
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})