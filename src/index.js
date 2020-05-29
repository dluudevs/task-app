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