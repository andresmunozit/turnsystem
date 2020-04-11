// This module makes application start to listen through the port defined by the environment variable "PORT"
// This module allows to separate the express aplication, for testing purposes. Testing never starts to listening, just executes the './app.js' module.
const app = require('./app')

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})