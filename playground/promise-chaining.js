require('../src//db/mongoose')
const User = require('../src/models/user')

// User.findByIdAndUpdate("5ecf0b9d9a47df24e09dcfb6", { age: 1 })
//   .then(user => {
//     console.log(user)
//     // to chain promises, a promise must be returned by the callback function inside of then
//     return User.countDocuments({ age: 1 })
//   })
//   .then(result => console.log(result))
//   .catch(error => console.log(error))

  const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments({ age })
    return count
  }

  updateAgeAndCount("5ecf0b9d9a47df24e09dcfb6", 2)
    .then(count => console.log(count))
    .catch(error => console.log(error))