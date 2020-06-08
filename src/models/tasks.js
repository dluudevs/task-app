const mongoose = require('mongoose')

const Task = mongoose.model('Task', {
  description: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false
  },
  owner: {
    // type used for object id
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // create reference from this field to another model. the reference must match the name of the model in its mongoose.model method
    // allows us to populate all documents that match the value in this field
    ref: 'User'
  }
})

module.exports = Task