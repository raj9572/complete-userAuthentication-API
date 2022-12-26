require('dotenv').config()
const express = require('express')
const connectToMongo = require('./db')
const app = express()
const port = process.env.PORT || 8000



app.use(express.json())
//available routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port,() => {
     connectToMongo()
    console.log(`Example app listening on port ${port}`)
})