const express = require('express')
const hbs = require('hbs')
const path = require('path') // Used to serve static files
const queueRouter = require('./routers/queue')
require('./db/mongoose') // Mongoose configuration (connection and parameters)

// Variable definitions
const publicDirPath = path.join(__dirname, '../public') // Static assets folder
const viewsPath = path.join(__dirname, '../views') // "views" is the default path for views in hbs, it can be changed here in the future
const partialsPath = path.join(__dirname, '../views/partials')

// Express configuration
const app = express()
app.use(express.json())
app.use(express.static(publicDirPath))
app.use(queueRouter)

// Hbs (Handlebars Express Plugin) configuration
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// The Express aplication starts to listen when ./index.js is executed. This module is executed used by Supertest to test the Express application.
module.exports = app