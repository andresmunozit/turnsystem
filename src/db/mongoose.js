const mongoose = require('mongoose')

// DB_PATH must be defined as a environment variable
mongoose.connect(process.env.DB_PATH, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})