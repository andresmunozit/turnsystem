// This module makes application start to listen through the port defined by the environment variable "PORT"
const app = require('./app')

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})