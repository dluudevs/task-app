const mongodb = require('mongoDB')
// MonogClient property gives access to database to perform CRUD operations
// ObjectID to create our own IDs instead of letting the MongoDB handle it
const { MongoClient, ObjectID } = require('mongoDB')

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
  // to insert document call .insertOne or .insertMany on db. References available in course PDF
  // db.collection('users').findOne({ _id: new ObjectID('5ecc424034dcb30bac5b5615')}, (error, user) => {
  //   if (user){
  //     return console.log('Unable to fetch')
  //   }

  //   console.log(user)
  // })

  // returns a cursor with various methods to query what you need
  // db.collection('users').find({ age: 30 }).toArray((error, users) => {
  //   if (error){
  //     return console.log('Unable to fetch')
  //   }

  //   console.log(users)
  // })

  // db.collection('users').find({ age: 30 }).count((error, count) => {
  //   if (error){
  //     return console.log('Unable to fetch')
  //   }

  //   console.log(count)
  // })
  db.collection('tasks').findOne({ _id: new ObjectID("5ecc37c724f1cf0580512e87") }, (error, user) => {
    if (error){
      return console.log('Unable to fetch')
    }

    console.log(user)
  })

  db.collection('tasks').find({ completed: false }).toArray((error, tasks) => {
    if (error){
      return console.log('Unable to fetch')
    }

    console.log(tasks)
  })

})