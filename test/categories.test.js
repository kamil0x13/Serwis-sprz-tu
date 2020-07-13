const request = require('supertest')
const app = require('../src/app')
const Categories = require('../src/models/categories')
const { userOneId, userOne, setupDatabase, categoryOne, categoryTwo, categoryThree } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create category for user', async () => {
    const res = await request(app)
        .post('/categories')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'C1',
            description: 'opis'
        })
        .expect(201)
    const category = await Categories.findById(res.body._id)
    expect(category).not.toBeNull()
})

test('Should get own categories for user', async () => {
    const res = await request(app)
        .get('/categories/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(res.body.length).toEqual(2)
})

test('Should not delate other user category', async () => {
    await request(app)
        .delete(`/categories/${categoryTwo._id}`)
        .send()
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(404)
    const cat = await Categories.findById(categoryOne._id)
    expect(cat).not.toBeNull()
})