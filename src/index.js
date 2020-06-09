const express = require('express')
// calling require ensure this file runs (mongoose will connect to database)
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/tasks')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

// use customizes server to parse incoming json to a JavaScript object. Becomes accessible in request parameter in the various methods' callback
app.use(express.json())
// setup app to use various routers. routers contain CRUD methods for each endpoint, this helps organize our code
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
  console.log('Server is up on', port)
})

// multer is middleware and must be passed as such to route
const multer = require('multer')
const upload = multer({ 
  // where uploads are saved
  dest: 'images'
})

// the returned value of upload.single is what is being passed as middleware. (the argument passed is the name of the upload)
// middleware tells multer to look for file named upload when the request comes in. this will be the key in the request's body
app.post('/upload', upload.single('upload'), (req, res) => {
  res.send()
})

// const avatar = multer({
//   dest: 'avatar'
// })

// app.post('/users/me/avatar', avatar.single('avatar'), (req, res) => {
//   res.send()
// })