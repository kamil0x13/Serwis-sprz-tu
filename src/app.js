const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const categoriesRouter = require('./routers/categories')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(categoriesRouter)
app.use(express.static('public'))

module.exports = app