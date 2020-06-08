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

const main = async () => {
  // const task = await Task.findById('5edc3d92bccdee8704ee47cd')
  // // populate all data from a relationship, in this case we want to populate our reference to owner
  // // will use the ID to find associated user profile and assign it to task.owner
  // await task.populate('owner').execPopulate()
  // console.log(task.owner)

  const user = await User.findById('5edc3a464942da8b84ca444e')
  await user.populate('tasks').execPopulate()
  // console.log(user.tasks)
}

main()