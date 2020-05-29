// it is a object document modeling library that uses node.js and mongodb
// lets developers define a schema (data structure) for their documents on node 
const mongoose = require('mongoose')

// string after url is the name of the database. different name than mongodb because the data here will look different
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
  useNewUrlParser: true,
  // ensures when mongoose works with mongodb, a new index is created
  useCreateIndex: true,
  // removes deprecation warning for useFindAndModify
  useFindAndModify: false
})

