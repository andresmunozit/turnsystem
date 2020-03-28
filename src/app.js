const express = require('express')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.get('/test', (req, res) => {
    res.send({message: 'Ok'})
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})