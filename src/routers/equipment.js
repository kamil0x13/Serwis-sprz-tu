const express = require('express')
const Equipment = require('../models/equipment')
const Categories = require('../models/categories')
const { auth, authOwnCategory, authAccesedCategory } = require('../middleware/auth')
const User = require('../models/user')
const router = new express.Router()


//Create
router.post('/equipment', auth, authOwnCategory, async (req, res) => {
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

//Get own
router.get('/equipment/own', auth, authOwnCategory, async (req, res) => {
    try {
        await req.category.populate({
            path: 'equipment'
        }).execPopulate()
        res.send(req.category.equipment)
    } catch (e) {
        res.status(500).send()
    }
})

//Get accesed
router.get('/equipment/acces', auth, authAccesedCategory, async (req, res) => {
    try {
        await req.category.populate({
            path: 'equipment'
        }).execPopulate()
        res.send(req.category.equipment)
    } catch (e) {
        res.status(500).send()
    }
})

//Update
router.patch('/equipment/own', auth, authOwnCategory, async (req, res) => {
    // const equipment = await Equipment.findOne({ _id: req.body.equipmentId, categories: req.category._id })
    // if (!equipment) {
    //     res.status(404).send()
    // }
    try {
        await req.category.populate({
            path: 'equipment'
        }).execPopulate()
        const equipment = req.category.equipment.find((eq) => {
            if (eq._id === req.body.equipmentId) {
                return true
            }
        })
        if (!equipment) {
            res.status(404).send()
        }
        if (req.body.name) {
            equipment.name = req.body.name
        }

        if (req.body.description) {
            equipment.description = req.body.description
        }

        equipment.save()
        res.send()

    } catch (e) {
        res.status(500).send()
    }
})



module.exports = router