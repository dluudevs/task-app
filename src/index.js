const express = require('express')
// calling require ensure this file runs (mongoose will connect to database)
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/tasks')

const app = express()
const port = process.env.PORT || 3000

// customize server to parse incoming json to a JavaScript object. Becomes accessible in request parameter in the various methods' callback
app.use(express.json())

app.post('/users', (req, res) => {
  // in client request body contains all the data to be sent to the server, here we have user details (ie., name)
  const user = new User(req.body)
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