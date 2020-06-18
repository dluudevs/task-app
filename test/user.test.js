// supertest is a library created by express that allows us to easily run our test server / tests
// otherwise we would have to run the server and tests separately
const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')

const userOne = {
  name: 'Mike',
  email: 'mike@example.com',
  password: '56what!!'
}

// runs before each test case
beforeEach(async () => {
  // no argument passed to deleteMany delete everything inside of the User collection
  // with await, jest will only move on to test cases when promise is resolved (users are all deleted)
  await User.deleteMany()
  await new User(userOne).save()
})

// for tests to run smoothly, the database must be cleared otherwise tests below would fail because you wont be able to create a user that already exists
// this is why there is a test.env file with another database so it doesnt conflict with the local one
test('Should sign up a new user', async () => {
  // post to /users endpoint and send object
  await request(app).post('/users').send({
    name: 'Derek',
    email: 'derek@example.com',
    password: 'red123$'
  }).expect(201) // expect 201 status 
})

test('Should login existing user', async () => {
  await request(app).post('/users/login').send({
    email: userOne.email,
    password: userOne.password
  }).expect(200)
})

test('should not login nonexistent user', async () => {
  await request(app).post('/users/login').send({
    email: 'randomEmail@randomDomain.com',
    password: 'randomPW123!'
  }).expect(400)
})