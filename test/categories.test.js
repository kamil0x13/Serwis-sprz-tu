const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')


const userOne = {
    name: "First",
    lastName: "Lastname",
    email: "first@gmail.com",
    password: "First123"
}
beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()
})

test('Schould signup a new user', async () => {
    await request(app).post('/users').send({
        name: 'Kamil',
        lastName: 'Pietrzak',
        email: 'kamil1@gmail.com',
        password: 'Bluase12#3'
    }).expect(201)
})

test('Should login existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
})

test('Should not login nonexisistent user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'badPass'
    }).expect(400)
})
