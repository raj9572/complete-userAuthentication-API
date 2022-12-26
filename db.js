const mongoose = require('mongoose')


const Mongo_Url = process.env.MONGO_URL
mongoose.set('strictQuery', true)

const connectToMongo = () => {
    mongoose.connect(Mongo_Url,
        { useNewUrlParser: true, useUnifiedTopology: true }).then(() => { console.log('connected to Mongodb succesfully'); });

}

module.exports = connectToMongo;