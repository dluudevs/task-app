const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account')

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

router.post('/users', async (req, res) => {
  // in client request body contains all the data to be sent to the server, here we have user details (ie., name)
  const user = new User(req.body)
  
  try {
    // https://mongoosejs.com/docs/api/model.html
    await user.save()
    sendWelcomeEmail(user.email, user.name)
    // generate token once a new user is added to collection so user doesn't have to login. (only runs when above promise is fulfilled)
    const token = await user.generateAuthToken()
    // errors by default sends 200 status code, this is misleading
    res.status(201).send({ user, token })
  } catch (e) {
    // 4xx is for when the user does something wrong 5xx for network error
    res.status(400).send(e)
  }
})

// post method because authentication requires an auth token to be generated
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
router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  // tests whether all elements in array passes test implemented in callback function, returns a callback value
  // one false will return value of false, requires all true to return value of true
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Updates' })
  }

  try {
    const user = req.user
    updates.forEach((update) => user[update] = req.body[update])
    await user.save()

    res.send(user)
  } catch (e) {
    // when user fails validation
    res.status(400).send(e)
  }
})

router.delete('/users/me', auth, async(req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id)
    
    // if (!user){
      //   return res.status(404).send()
      // }
      
    // auth middleware function passes the user object
    // since the user is retrieved with the auth middleware function we have the credentials necessary to remove the user directly (the above code is no longer necessary)
    // this holds true for any routes that use auth as middleware function
    await req.user.remove()
    sendCancelEmail(req.user.email, req.user.name)
    res.send(req.user)
  } catch (e) {
    res.status(500).send()
  }
})

// multer is middleware and must be passed as such to route
const upload = multer({ 
  // by removing dest option, the files will not save in project folder. this isnt sustainable because it requires a push every time user uploads an image which isnt possible 
  // the file will now be passed to the route handler
  // dest: 'avatars',
  limits: {
    fileSize: 1000000
  },
  // cb is the callback to tell multer fileFilter is done running
  fileFilter(req, file, cb){
    // regex: / escapes the '.' paranthesis for group match '|' is for alternate (jpg OR jpeg OR PNG) '$' means at the end of the string
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('File must be a picture'))
    }

    // first argument is error, second argument is true if file is accepted
    cb(undefined, true)
  }
})

// the returned value of upload.single is what is being passed as middleware. (the argument passed is the name of the upload)
// middleware tells multer to look for file named upload when the request comes in. this will be the key in the request's body
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  res.send()
  // uploaded file. buffer is where the data is temporarily stored waiting to be processed (like RAM)
  // convert the file and save it to buffer so that it can be accessed later
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()
  req.user.avatar = buffer
  await req.user.save()
// third argument is a callback that only runs when an error is thrown in the route
// all 4 arguments necessary so express knows this function is meant to handle errors
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
  // setting property to undefined will remove it from the user object
  req.user.avatar = undefined
  await req.user.save()
  res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
  // try block incase user cannot be found
  // not using auth because if a user wants to look at another user's avatar they should be able to do so
  try {
    const user = await User.findById(req.params.id)

    if (!user || !user.avatar) {
      // will be caught by catch block
      throw new Error()
    }
    // sets headers - express automatically sets this property. eg., when sending json back, express sets the value too application/json
    // using set we can set the response to an image
    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  } catch (e) {
    res.status(400).send()
  }
})

// export router all the routes are just methods of the router object
module.exports = router