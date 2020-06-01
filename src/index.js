const express = require('express')
// calling require ensure this file runs (mongoose will connect to database)
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/tasks')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

// customize server to parse incoming json to a JavaScript object. Becomes accessible in request parameter in the various methods' callback
app.use(express.json())
// setup app to use various routers. routers contain CRUD methods for each endpoint, this helps organize our code
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
  console.log('Server is up on', port)
})

const bcrypt = require('bcryptjs')

const myFunction = async () => {
  const password = "red12345!"
  // hashing converts plain text passswords into unreadable strings, cannot be reverse to plain text password
  // second argument = number of rounds, the number of the times the hashing algorithm is executed
  const hashedPassword = await bcrypt.hash(password, 8)

  console.log(password)
  console.log(hashedPassword)

  // compare hashes plain text password and compares with hashedpassword to authenticate users
  const isMatch = await bcrypt.compare('red12345!', hashedPassword)
  console.log(isMatch)
}

myFunction()