const request = require('supertest')
const app = require('../src/app')
const Categories = require('../src/models/categories')
const { userOneId, userOne, setupDatabase, categoryOne, categoryTwo, categoryThree } = require('./fixtures/db')
const Equipment = require('../src/models/equipment')

beforeEach(setupDatabase)


test('Should create equipment for category', async () => {
    const res = await request(app)
        .post('/equipment')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            categoryId: categoryOne._id,
            name: 'C1',
            description: 'opis'
        })
        .expect(201)
    const equipment = await Equipment.findById(res.body._id)
    expect(equipment).not.toBeNull()
})
