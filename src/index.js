const express = require('express')
// calling require ensure this file runs (mongoose will connect to database)
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/tasks')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

// function passed to use method acts as middleware function
// without middleware: new request -> new request -> run router handler
// with middleware: new request -> do something -> run route handler
// app.use((req, res, next) => {
//   if (req.method === "GET"){
//     res.send('GET requests are disabled!')
//   } else {
//     // next ends the function and runs route handler (similar to mongoose's use of next in its middleware)
//     next()
//   }
// })

// app.use((req, res, next) => {
//   res.status(503).send('Site is currently down. Check back soon!')
// })

// use customizes server to parse incoming json to a JavaScript object. Becomes accessible in request parameter in the various methods' callback
app.use(express.json())
// setup app to use various routers. routers contain CRUD methods for each endpoint, this helps organize our code
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
  console.log('Server is up on', port)
})

const jwt = require('jsonwebtoken')

const myFunction = async () => {
  // method returns authentication token
  // object requires unique identifier for user being authenticated
  // second argument signs the token, making sure the token hasn't been altered in anyway - just requires random series of characters
 const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse', { expiresIn: '7 days'})
  

  // returns payload if token is valid (user authenticated properly), otherwise an error is thrown
 const data = jwt.verify(token, 'thisismynewcourse')
}

myFunction()