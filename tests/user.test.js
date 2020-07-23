// supertest is a library created by express that allows us to easily run our test server / tests
// otherwise we would have to run the server and tests separately
const request = require('supertest')

const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

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
    // sets header key value pairs
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

test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200)

  const user = await User.findById(userOneId)
  console.log(user)
  // check if avatar is binary data stored in a buffer
  // expect.any takes in a constructor function for some sort of type (eg., String, Number, Buffer)
  // expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    // send is the body (json object in postman)
    .send({name: 'Delvv'})
    .expect(200)

  const user = await User.findById(userOneId)
  expect(user.name).toBe('Delvv')
})

test('should not update invalid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ location: 'Toronto'})
    .expect(400)
})
