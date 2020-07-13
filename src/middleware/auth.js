const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Categories = require('../models/categories')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

const authCategory = async (req, res, next) => {
    try {
        const categoryId = req.body.categoryId

        const category = await Categories.findOne({ _id: categoryId, owner: req.user._id })
        if (!category) {
            throw new Error()
        }
        req.category = category
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate category.' })
    }
}

module.exports = {
    auth,
    authCategory
}