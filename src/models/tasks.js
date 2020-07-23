const mongoose = require('mongoose')

// A MongoDB schema defines the structure of any documents that are stored in a particular collection. You can think of it as blueprints to build a house.
// A MongoDB document would be a single house built from the house blueprint (schema) above.
// A MongoDB model provides the interface to perform Create, Read, Update and Delete (CRUD) operations on the collection as a whole or an individual document.

// create a schema for tasks because it is the only way we can pass a configuration object to enable timestamps
const taskSchema = mongoose.Schema(
  {
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
      // User must authenticated to retrieve their tasks as the task model requires the value for user._id
      ref: 'User'
    },
    picture: {
      type: Buffer
    },
  }, 
  {
    timestamps: true
  }
)

const Task = mongoose.model('Task', taskSchema)

module.exports = Task