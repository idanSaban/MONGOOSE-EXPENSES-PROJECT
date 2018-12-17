// Server setup
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const api = require('./server/routes/api')

// Mongoose setup
const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.connect('mongodb://localhost/peopleDB', { useNewUrlParser: true })

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/',api)

const port = 4200
app.listen(port, function () {
    console.log(`Running on port ${port}`)
})