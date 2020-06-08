const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
    // when adding unique to an existing collection, the collection must be wiped for this property to take effect
    unique: true,
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
  },
  // tokens property is an array of objects with a token property
  // items inside the array are sub-documents and will have their own objectid generated
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
})

// virtual property - not data stored in database, but a relationship between two entities. between user and tasks
// virtual because not changing what is stored in the user document, just a way for mongoose to determine how these two things are related
// first argument is name for virtual field, second argument configures the field
// this essentially allows us to populate without actually storing tasks in the user model 
userSchema.virtual('tasks', {
  ref: 'Task',
  // field that ref (task) is associated with locally (user). task uses relationship with user to find the user profile using the _id
  localField: '_id',
  // name of the field on the (ref) task that is creating this relationship
  foreignField: 'owner'
  // in the tasks model; owner is the local field and _id is the foreignField
  // use localField value to find tasks with the same value in the foreignField
})

// without middleware: new request -> new request -> run router handler
// with middleware: new request -> do something -> run route handler

// mongoose middlewhere lets us hash in one spot instead of having to change the functionality at each route
// function runs when save event occurs                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 - must be function declaration as this keyword needs to be binded to the function 
userSchema.pre('save', async function(next){
  // this represents the document (user) that is about to be saved
  const user = this 
  
  // only hash if password has been modified
  if (user.isModified('password')) {
    // change user password to its hash format. passwords are plain text, convert to hash to protect user's privacy
    // hashed passwords cannot be reverted to its plain text format
    user.password = await bcrypt.hash(user.password, 8)  
  }
  // when function is complete (including async tasks) call next, otherwise applicaton would hang
  next()
})

// function declaration as this keyword needs to be binded to function
// add method to methods property (aka instance methods) - methods added to methods property are only accessible on instances (eg., a document)
// method store in user instance - stores a signed JWT token to the database and pass the token to the router handler function
userSchema.methods.generateAuthToken = async function() {
  const user = this
  // id is an Object, must be converted to string for jwt
  // sign method requires data and secret that signs the token
  const token = jwt.sign({_id: user._id.toString()}, "thisismynewcourse")
  // jwt token is to create data (with object) that is verifiable with the signature (second argument)
  // jwt token seperated by two periods. first part = header, second = object, third = signature
  user.tokens = [...user.tokens, { token } ]
  await user.save()

  // return token because routers will need access to the token (users/login)
  return token
}

// method must be named toJSON
// when expresss sends request, JSON.stringify(obj) runs behind the scenes (converts JS object to JSON string) 
// .toJSON method gets called whenever the object gets passed to JSON.stringify(). this method gets called before stringify and passes the returned value to JSON.stringify
// because of this, we can manipulate the object before it is sent to the user
userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  // delete is an operator that removes a property from an object
  delete userObject.password
  delete userObject.tokens

  return userObject
}

// to create custom methods, much like above; a schema must be passed to mongoose.model
// add method to statics property (aka model methods) - static methods are only accessible on the model 
userSchema.statics.findByCredentials = async (email, password) => {
  // User represents User collection
  const user = await User.findOne({ email })

  if (!user){
    throw new Error('Unable to login')
  }

  // convert plain text pw to hash and compare with hashed password (pw stored in collection)
  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch){
    throw new Error('Unable to login')
  }

  // this will return a promise because this is an async function
  return user

}

// models define the structure of the collection
// constructor function for model
// pass in schema instead of object. when object is passed, mongoose converts it to a schema behind the scenes
const User = mongoose.model('User', userSchema)

module.exports = User