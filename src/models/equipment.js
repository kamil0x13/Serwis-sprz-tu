const mongoose = require('mongoose')
//const validator = require('validator')

const equipmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    toDo: [{
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        whoAdded: {
            type: String,
            required: true
        }
    }],
    done: [{
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        whoAdded: {
            type: String,
            required: true
        },
        whoEnd: {
            type: String,
            required: true
        }
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    categories: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Categories'
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

const Equipment = mongoose.model('Equipment', equipmentSchema)

module.exports = Equipment
