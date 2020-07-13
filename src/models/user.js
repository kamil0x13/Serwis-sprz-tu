const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Categories = require('./categories')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(v) {
            if (!validator.isEmail(v)) {
                throw new Error('Nie poprawny email')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(v) {
            if (v.toLowerCase().includes('password')) {
                throw Erro('Hasło nie może zwierać słowa "password"')
            }
        }
    },
    pro: {
        type: Date,
        default: 0
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

//Tworzenie relacji
userSchema.virtual('categories', {
    ref: 'Categories',
    localField: '_id', // nazwa pola łączącego 
    foreignField: 'owner' // nazwa pola z _id w task
})

userSchema.virtual('categories_accesed', {
    ref: 'Categories',
    localField: '_id', // nazwa pola łączącego 
    foreignField: 'acces._id' // nazwa pola z _id w task
})


//Metody dostępne na instancjach (.methods)

//Generowanie Tokenu Autoryzacji
userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET)

    this.tokens = this.tokens.concat({ token })
    await this.save()

    return token
}

//Przekazywanie JSON bez hasła i tokenów nazwa funkcji działa jak toStrion z Javy >> poprostu po podaniu nazwy instancji (JSON.stringify(instancja))
userSchema.methods.toJSON = function () {
    const userObject = this.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

//Metody statyczna dostępne są na obiektach (.statics)

//Sprawdzanie logowania
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Niepoprawne dane logowania!')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Niepoprawne dane logowania!')
    }
    return user
}

//Szukanie usera po emailu
userSchema.statics.findByEmail = async (email) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Brak użytkownika w bazie!')
    }
    return user
}

//Hash hasło przed zapisaniem
userSchema.pre('save', async function (next) {

    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }

    //musi tu być aby zapisać usera
    next()
})

//Usuwanie categories gdy ktoś usuwa konto
userSchema.pre('remove', async function (next) {
    await Categories.deleteMany({ owner: this._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User