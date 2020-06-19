// supertest is a library created by express that allows us to easily run our test server / tests
// otherwise we would have to run the server and tests separately
const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')

// use mongoose method to create new instance of objectid
const userOneId = new mongoose.Types.ObjectId()
const userOne = {
  _id: userOneId,
  name: 'Mike',
  email: 'mike@example.com',
  password: '56what!!',
  tokens: [
    {
      token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }
  ]
}

// runs before each test case
beforeEach(async () => {
  // no argument passed to deleteMany delete everything inside of the User collection
  // with await, jest will only move on to test cases when promise is resolved (users are all deleted)
  await User.deleteMany()
  // save a new user 
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

test('should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    // sets header
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete profile for authenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not delete profile for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})