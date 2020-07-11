const express = require('express')
const Categories = require('../models/categories')
const auth = require('../middleware/auth')
const User = require('../models/user')
const router = new express.Router()


router.post('/categories', auth, async (req, res) => {
    const categories = new Categories({
        ...req.body,
        owner: req.user._id
    })

    try {
        await categories.save()
        res.status(201).send(categories)
    } catch (e) {
        res.status(400).send(e)
    }
})

//GET // {{url}}/tasks?limit=2&skip=1&completed=true
//GET // {{url}}/tasks?sortBy=createdAt:desc
router.get('/categories', auth, async (req, res) => {
    const sort = {}

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    const options = {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
    }
    try {
        //const categories = await Categories.find({ owner: req.user._id })
        await req.user.populate({
            path: 'categories',
            options
        }).execPopulate()
        res.send(req.user.categories)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/categories/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const categories = await Categories.findOne({ _id, owner: req.user._id })
        if (!categories) {
            return res.status(404).send()
        }
        res.send(categories)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/categories/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'name', 'acces']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Niepoprawny update!' })
    }

    try {
        const categories = await Categories.findOne({ _id: req.params.id, owner: req.user._id })
        //Zmiana umożliwiająca korzystanie z Middlayer save  <<
        if (!categories) {
            return res.status(404).send()
        }
        updates.forEach(update => categories[update] = req.body[update])
        await categories.save()
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        res.send(categories)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/categories/:id', auth, async (req, res) => {
    try {
        const categories = await Categories.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!categories) {
            return res.status(404).send()
        }
        res.send(categories)
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/categories/:id/addAcces', auth, async (req, res) => {
    const email = req.body.email
    let user = undefined
    if (!email) {
        res.status(400).send('Nie podano adresu!')
    }
    try {
        user = await User.findByEmail(email)
    } catch (e) {
        res.status(404).send()
    }
    if (email === req.user.email) {
        res.status(400).send('Podaj email użytkownika któremu chcesz nadać dostęp! Podano twój email.')
    }
    const _id = req.params.id
    try {
        const categories = await Categories.findOne({ _id, owner: req.user._id })
        if (!categories) {
            return res.status(404).send()
        }
        let justHaveAcces = false
        categories.acces.every(c => {
            if (c._id.toString() === user._id.toString()) {
                if (req.body.change) {
                    c.options.change = req.body.change
                }
                justHaveAcces = true
                return false
            }
            return true
        })
        if (!justHaveAcces) {
            console.log(user._id)
            const options = { change: req.body.change }
            categories.acces.push({ _id: user._id, email: user.email, options })
        }
        console.log('a')
        await categories.save()
        res.send(categories)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router
