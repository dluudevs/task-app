// it is a object document modeling library that uses node.js and mongodb
// lets developers define a schema (data structure) for their documents on node 
const mongoose = require('mongoose')
const validator = require('validator')

// string after url is the name of the database. different name than mongodb because the data here will look different
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
  useNewUrlParser: true,
  // ensures when mongoose works with mongodb, a new index is created
  useCreateIndex: true,
})

// constructor function for model
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
  }
})

const me = new User({
  name: '      Derek    ',
  email: 'myemail@gmail.com        '
})

me.save()
  .then(me => console.log(me))
  .catch(error => console.log('error', error))

// string gets lower-cased and pluralized before being added as a collection in MongoDB
const Task = mongoose.model('Task', {
  description: {
    type: String
  },
  completed: {
    type: Boolean
  }
})

// const readBook = new Task({
//   description: 'Read Man\'s search for meaning',
//   completed: false
// })

// readBook.save()
//   .then(result => console.log(result))
//   .catch(error => console.log('error', error))

