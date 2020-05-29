const express = require('express')
// calling require ensure this file runs (mongoose will connect to database)
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/tasks')

const app = express()
const port = process.env.PORT || 3000

// customize server to parse incoming json to a JavaScript object. Becomes accessible in request parameter in the various methods' callback
app.use(express.json())

// async doesn't change anything, as express doesn't require a return value (async will always return a resolved promise with returned value)
app.get('/users', async (req, res) => {
  // will try and catch individual promises (since async tasks run one at a time)
  try {
    // Searches the model (collection) for all documents
    const users = await User.find({})
    // only runs when promise above is fulfilled
    res.send(users)
  } catch (e) {
    // if get request fails, it is usually due to a network issue
    res.status(500).send
  }
})

// : grants access to the dyanmic value (router parametrs) in the route, this is something the user chooses
app.get('/users/:id', async (req, res) => {
  // contains route parameters as an object
  const _id = req.params.id
  try {
    const user = await User.findById(_id)
    // With mongoose, if no user is found it will not throw an error
    if (!user){
      // return a 404 code if no user is found
      return res.status(404).send()
    }
    res.send(user)
  } catch (e) {
    res.status(500).send()
  }
})

app.get('/tasks', async (req, res) => {
  try {
    // no error handling required, since endpoint is searching for ALL documents. if it returns an empty array, nothing was found
    const task = await Task.find({})
    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})

app.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id
  try {
    const task = await Task.findById(_id)
    if (!task) {
      return res.status(404).send()
    }
    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})


app.post('/users', async (req, res) => {
  // in client request body contains all the data to be sent to the server, here we have user details (ie., name)
  const user = new User(req.body)
  try {
    // https://mongoosejs.com/docs/api/model.html
    await user.save()
    // errors by default sends 200 status code, this is misleading
    res.status(201).send(user)
  } catch (e) {
    // 4xx is for when the user does something wrong 5xx for network error
    res.status(400).send(e)
  }
})

app.post('/tasks', async (req, res) => {
  const task = new Task(req.body)
  try {
    await task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

// update 
app.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  // tests whether all elements in array passes test implemented in callback function, returns a callback value
  // one false will return value of false, requires all true to return value of true
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Updates' })
  }

  try {
    // option will return updated user and run validators from user model
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!user){
      return res.status(404).send()
    }

    res.send(user)
  } catch (e) {
    // when user fails validation
    res.status(400).send(e)
  }
})

app.patch('/tasks/:id', async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isUpdateAllowed = updates.every(update => allowedUpdates.includes(update))

  if (!isUpdateAllowed){
    return res.status(400).send({ error: "Invalid Updates"})
  }

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})

    if (!task){
      return res.status(404).send()
    }

    res.send(task)
  } catch (e) {
    // when user fails validation
    res.status(400).send(e)
  }
})

app.delete('/users/:id', async(req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    
    if (!user){
      return res.status(404).send()
    }

    res.send(user)
  } catch (e) {
    res.status(500).send()
  }
})

app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)

    if (!task){
      return res.status(404).send()
    }

    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})

app.listen(port, () => {
  console.log('Server is up on', port)
})