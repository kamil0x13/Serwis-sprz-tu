const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Categories = require('../../src/models/categories')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: "First",
    lastName: "Lastname",
    email: "first@gmail.com",
    password: "First123",
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: "Second",
    lastName: "Lastname",
    email: "second@gmail.com",
    password: "Second123",
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const categoryOne = {
    _id: new mongoose.Types.ObjectId(),
    name: 'First cat',
    description: 'desc 1',
    owner: userOne._id
}

const categoryTwo = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Second cat',
    description: 'desc 2',
    owner: userTwo._id
}

const categoryThree = {
    _id: new mongoose.Types.ObjectId(),
    name: '3 cat',
    description: 'desc 3',
    owner: userOne._id
}


const setupDatabase = async () => {
    await User.deleteMany()
    await Categories.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Categories(categoryOne).save()
    await new Categories(categoryTwo).save()
    await new Categories(categoryThree).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    categoryOne,
    categoryTwo,
    categoryThree,
    setupDatabase
}