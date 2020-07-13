const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Schould signup a new user', async () => {
    const res = await request(app).post('/users').send({
        name: 'Kamil',
        lastName: 'Pietrzak',
        email: 'kamil1@gmail.com',
        password: 'Bluase12#3'
    }).expect(201)

    const user = await User.findById(res.body.user._id)
    expect(user).not.toBeNull()

    expect(res.body.user.name).toBe('Kamil')
    expect(res.body).toMatchObject({
        user: {
            name: 'Kamil',
            lastName: 'Pietrzak',
            email: 'kamil1@gmail.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('Bluase12#3')
})

test('Should login existing user', async () => {
    const res = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(userOneId)
    expect(res.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexisistent user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'badPass'
    }).expect(400)
})

test('Should get profil for user', async () => {
    await request(app).get('/users/me').set('Authorization', `Bearer ${userOne.tokens[0].token}`).send().expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app).get('/users/me').send().expect(401)
})

test('Should delate account for user', async () => {
    await request(app).delete('/users/me').set('Authorization', `Bearer ${userOne.tokens[0].token}`).send().expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delate account for unauthenticated user', async () => {
    await request(app).delete('/users/me').send().expect(401)
})

test('Should upload avatra image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'test/fixtures/avatar.jpg')
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user field', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'UpdatedName',
        })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('UpdatedName')
})

test('Should not update invalid user field', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            nameee: 'UpdatedName',
        })
        .expect(400)
})

