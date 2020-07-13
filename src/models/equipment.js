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
    categories: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Categories'
    }
}, {
    timestamps: true
})

const Equipment = mongoose.model('Equipment', equipmentSchema)

module.exports = Equipment
