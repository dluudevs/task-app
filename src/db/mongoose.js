// it is a object document modeling library that uses node.js and mongodb
// lets developers define a schema (data structure) for their documents on node 
const mongoose = require('mongoose')

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
    type: String
  },
  age: {
    type: Number
  }
})

// const me = new User({
//   name: 'Derek',
//   age: 'Mike'
// })

// me.save()
//   .then(me => console.log(me))
//   .catch(error => console.log('error', error))

// string gets lower-cased and pluralized before being added as a collection in MongoDB
const Task = mongoose.model('Task', {
  description: {
    type: String
  },
  completed: {
    type: Boolean
  }
})

const readBook = new Task({
  description: 'Read Man\'s search for meaning',
  completed: false
})

readBook.save()
  .then(result => console.log(result))
  .catch(error => console.log('error', error))

