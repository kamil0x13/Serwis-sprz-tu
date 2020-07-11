const mongoose = require('mongoose')
//const validator = require('validator')

const categoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    acces: [{
        email: {
            type: String,
            required: true
        },
        options: {
            change: {
                type: Boolean,
                default: false
            },
            addAcces: {
                type: Boolean,
                default: false
            }
        }
    }]
}, {
    timestamps: true
})

const Categories = mongoose.model('Categories', categoriesSchema)

module.exports = Categories