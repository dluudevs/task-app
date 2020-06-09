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
  dest: 'images',
  limits: {
    // uses bytes as unit of measure 
    fileSize: 1000000
  },
  // cb is the callback to tell multer fileFilter is done running
  fileFilter(req, file, cb){
    // endsWith is JavaScript string method
    // regex: / escapes the '.' paranthesis for group match '|' is for alternate (doc OR docx) '$' means at the end of the string
    if (!file.originalname.match(/\.(doc|docx)$/)) {
      return cb(new Error('Please upload a word document'))
    }

    // first argument is error, second argument is true if file is accepted
    cb(undefined, true)
  }
})

const errorMiddleware = (req, res, next) => {
  throw new Error('From my middleware')
}

// third argument is a callback that only runs when an error is thrown in the route
app.post('/upload', upload.single('upload'), (req, res) => {
  res.send()
// all 4 arguments necessary so express knows this function is meant to handle errors
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})
