const mongoose = require('mongoose')
const validator = require('validator')

// / constructor function for model
const User = mongoose.model('User', {
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

module.exports = User