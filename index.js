require('dotenv').config()
const express = require('express')
const connectToMongo = require('./db')
const app = express()
const port = process.env.PORT || 8000
const cors = require('cors')



app.use(express.json())
app.use(cors())

//available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
    connectToMongo()
    console.log(`iNotebook app listening on port ${port}`)
})