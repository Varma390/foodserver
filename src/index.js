const app = require('./app')
const mongoose = require('mongoose')
require('dotenv').config() // why

const port = process.env.PORT || 3001

mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGO_ATLAS,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("connected to Database"))
.catch((err) => console.log(err))

app.listen(port,() => console.log(`app is listening on given port ${port}`))
