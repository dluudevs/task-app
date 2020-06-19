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
  const response = await request(app).post('/users').send({
    name: 'Derek',
    email: 'derek@example.com',
    password: 'red123$'
  }).expect(201) // expect 201 status 

  // Assert that the database was changed correctly
  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()

  // Assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: 'Derek',
      email: 'derek@example.com'
    },
    token: user.tokens[0].token
  })

  expect(user.password).not.toBe('red123$')
})

test('Should login existing user', async () => {
  const response = await request(app).post('/users/login').send({
    email: userOne.email,
    password: userOne.password
  }).expect(200)

  const user = await User.findById(response.body.user._id)
  // expect that the newly generated token is added to the documents token property (this happens via the generateAuthToken method defined in the User model)
  expect(response.body.token).toBe(user.tokens[1].token)
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

test('Should delete account for user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  // assert that user is deleted from database
  const user = await User.findById(userOneId)  
  expect(user).toBeNull()
})

test('Should not delete profile for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})