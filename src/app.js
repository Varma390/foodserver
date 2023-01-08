const express = require('express')
const app = express()
const loginroute = require('./routes/loginRoute')
const otherroute = require('./routes/otherroutes')

app.use(express.json())
app.use('/',loginroute)
app.use('/recipe',otherroute)



module.exports = app