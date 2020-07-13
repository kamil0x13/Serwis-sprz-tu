const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const categoriesRouter = require('./routers/categories')
const equipmentRouter = require('./routers/equipment')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(categoriesRouter)
app.use(equipmentRouter)
app.use(express.static('public'))

module.exports = app