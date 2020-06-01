const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

// middleware to customize behaviour of mongoose model. middleware will run before or after certain events occur
// https://mongoosejs.com/docs/middleware.html
// create schema first and pass mongoose.model to take advantage of middleware

const userSchema = new mongoose.Schema({
  // types use constructor function from js as values
  name: {
    type: String,
    required: true,
    // data sanitization options (found under schematypes, scroll down to type)
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    // custom validation using validator library. data sanization options will always run before validate function
    validate(value) {
      if(!validator.isEmail(value)){
        throw new Error('Email is invalid')
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    // custom validation
    validate(value) {
      if (value < 0){
        throw new Error('Age must be a positive number')
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value) {
      if(value.toLowerCase().includes('password')){
        throw new Error('Your password cannot contain "password')
      }
    }
  }
})

// mongoose middlewhere lets us hash in one spot instead of having to change the functionality at each route
// must be function declaration as this keyword needs to be binded to the function
userSchema.pre('save', async function(next){
  // this represents the document (user) that is about to be saved
  const user = this 
  
  // only hash if password has been modified
  if (user.isModified('password')) {
    // change user password to its hash format
    user.password = await bcrypt.hash(user.password, 8)  
  }
  // when function is complete (including async tasks) call next, otherwise applicaton would hang
  next()
})

// models define the structure of the collection
// constructor function for model
// pass in schema instead of object. when object is passed, mongoose converts it to a schema behind the scenes
const User = mongoose.model('User', userSchema)

module.exports = User