const express = require('express')
// calling require ensure this file runs (mongoose will connect to database)
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/tasks')

const app = express()
const port = process.env.PORT || 3000

// customize server to parse incoming json to a JavaScript object. Becomes accessible in request parameter in the various methods' callback
app.use(express.json())

app.get('/users', (req, res) => {
  // Searches the model (collection) for all documents
  User.find({})
    .then(users => res.send(users))
    // if get request fails, it is usually due to a network issue
    .catch(e => res.status(500).send())
})

// : grants access to the dyanmic value (router parametrs) in the route, this is something the user chooses
app.get('/users/:id', (req, res) => {
  // contains route parameters as an object
  const _id = req.params.id
  User.findById(_id)
    .then(user => {
      // With mongoose, if no user is found it will not throw an error
      if (!user){
        // return a 404 code if no user is found
        return res.status(404).send()
      }

      res.send(user)
    })
    .catch((e) => res.status(500).send())
})

app.get('/tasks', (req, res) => {
  Task.find({})
    // no error handling required, since endpoint is searching for ALL documents. if it returns an empty array, nothing was found
    .then(task => res.send(task))
    .catch(() => res.status(500).send())
})

app.get('/tasks/:id', (req, res) => {
  const _id = req.params.id
  Task.findById(_id)
    .then(task => {
      if (!task){
        return res.status(404).send()
      }
      res.send(task)
    })
    .catch(() => res.status(500).send())
})

app.post('/users', (req, res) => {
  // in client request body contains all the data to be sent to the server, here we have user details (ie., name)
  const user = new User(req.body)
  // https://mongoosejs.com/docs/api/model.html
  user.save()
    // errors by default sends 200 status code, this is misleading
    // 4xx is for when the user does something wrong 5xx for network error
    .then(() => res.status(201).send(user))
    .catch(error => res.status(400).send(error))
})

app.post('/tasks', (req, res) => {
  const task = new Task(req.body)
  task.save()
    .then(() => res.status(201).send(task))
    .catch((e) => res.status(400).send(e))
})

app.listen(port, () => {
  console.log('Server is up on', port)
})