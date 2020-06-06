const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')

router.get('/test', (req, res) => {
  res.send('From a new file')
})

// async doesn't change anything, as express doesn't require a return value (async will always return a resolved promise with returned value)
// second argument is middleware, third argument is route handler
router.get('/users/me', auth, async (req, res) => {
  // the router handler will only run when user is authenticated (middleware)
  // the middleware function stored the user payload in req.user
  res.send(req.user)
})

// : grants access to the dyanmic value (router parametrs) in the route, this is something the user chooses
router.get('/users/:id', async (req, res) => {
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

router.post('/users', async (req, res) => {
  // in client request body contains all the data to be sent to the server, here we have user details (ie., name)
  const user = new User(req.body)
  
  try {
    // https://mongoosejs.com/docs/api/model.html
    await user.save()
    // generate token once a new user is added to collection so user doesn't have to login. (only runs when above promise is fulfilled)
    const token = await user.generateAuthToken()
    // errors by default sends 200 status code, this is misleading
    res.status(201).send({ user, token })
  } catch (e) {
    // 4xx is for when the user does something wrong 5xx for network error
    res.status(400).send(e)
  }
})

router.post('/users/login', async (req, res) => {
  try {
    // this is a custom method that was created with middleware inside of the user model. this is fine because the methos is searching witin the collection
    const user = await User.findByCredentials(req.body.email, req.body.password)
    // create method on user instance instead of the model, because this method generates a user specific token
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (e) { 
    res.status(400).send()
  }
})

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
    await req.user.save()

    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

// update 
router.patch('/users/:id', async (req, res) => {
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
    // requires runvalidators in options because findByIdAndUpdate method, bypasses mongoose's model and performs direct operation on databaSe
    const user = await User.findById(req.params.id)
    updates.forEach((update) => user[update] = req.body[update])
    await user.save()

    // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!user){
      return res.status(404).send()
    }

    res.send(user)
  } catch (e) {
    // when user fails validation
    res.status(400).send(e)
  }
})

router.delete('/users/:id', async(req, res) => {
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

// export router all the routes are just methods of the router object
module.exports = router