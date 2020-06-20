const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')

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

const setupDatabase = async () => {
  // no argument passed to deleteMany delete everything inside of the User collection
  // with await, jest will only move on to test cases when promise is resolved (users are all deleted)
  await User.deleteMany()
  // save a new user 
  await new User(userOne).save()
}

module.exports = {
  userOneId,
  userOne,
  setupDatabase
}