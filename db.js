const mongoose = require('mongoose')

const url = process.env.MONGO_URL
mongoose.set('strictQuery', true)

const connectToMongo = () => {
    mongoose.connect(url,
        {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }).then(() => { console.log('connected to Mongodb succesfully'); })
        .catch((error) => {
            console.error(`Error: ${error} `)
            process.exit(1)
        })

}

module.exports = connectToMongo;