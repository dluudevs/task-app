const mongodb = require('mongoDB')
// MongClient property gives access to database to perform CRUD operations
const MongoClient = mongodb.MongoClient

// localhost causes problems, use the localhost ip instead
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

// options requires useNewUrlParse to parse connection URL properly
MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
  if (error){
    return console.log('Unable to connect to database')
  }

  // this will automatically create the database for us, returns database reference
  const db = client.db(databaseName)

  // inserts document to 'users' collection
  // db.collection('users').insertOne({
  //   name: 'Derek',
  //   age: 30
  // }, (error, result) => {
  //   if (error) {
  //     return console.log('Unable to insert user')
  //   }

  //   console.log(result.ops)
  // })

  // db.collection('users').insertMany([
  //   {
  //     name: 'Jen',
  //     age: 28
  //   },
  //   {
  //     name: 'Gunther',
  //     age: 27
  //   }
  // ], (error, result) => {
  //   if (error){
  //     return console.log(error)
  //   }

  //   console.log(result.ops)
  // })

  db.collection('tasks').insertMany([
    {
      description: 'Job search',
      completed: true
    },
    {
      description: 'complete task app in node course',
      completed: false
    },
    {
      description: 'create a git repo for task app',
      completed: false
    }
  ], (error, result) => {
    if (error) {
      return console.log('Unable to insert tasks!')
    }

    console.log(result.ops)
  })
})