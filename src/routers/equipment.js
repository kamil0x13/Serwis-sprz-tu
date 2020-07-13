const express = require('express')
const Equipment = require('../models/equipment')
const Categories = require('../models/categories')
const { auth, authCategory } = require('../middleware/auth')
const User = require('../models/user')
const router = new express.Router()


//Create
router.post('/equipment', auth, authCategory, async (req, res) => {
    const equipment = new Equipment({
        ...req.body,
        categories: req.category._id
    })

    try {
        await equipment.save()
        res.status(201).send(equipment)
    } catch (e) {
        res.status(400).send(e)
    }
})


module.exports = router