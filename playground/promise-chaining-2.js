require('../src/db/mongoose')
const Task = require('../src/models/tasks')

// Task.findByIdAndDelete("5ecf165c7e2ee522bc69f2cd")
//   .then(task => {
//     console.log(task)
//     return Task.countDocuments({ completed: false })
//   })
//   .then(results => console.log(results))
//   .catch(error => console.log(error))

const deleteIncompleteTaskAndCount = async (id, completed) => {
  const deletedTask = await Task.findByIdAndDelete(id)
  const count = await Task.countDocuments({ completed: false })
  return count
}

deleteIncompleteTaskAndCount("5ed0661c92617b3e1c866c81")
  .then(count => console.log(count))
  .catch(error => console.log(error))