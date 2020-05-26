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
  // create, read, update, delete methods can all be found in the PDF guide
  // db.collection('users').deleteMany(
  //   { 
  //     age: 27
  //   }
  // ).then((result) => {
  //   console.log(result)
  // }).catch((error) => {
  //   console.log(error)
  // })

  db.collection('tasks')
  .deleteOne({ id: new ObjectID("5ecc37c724f1cf0580512e87")})
  .then(result => console.log(result.deletedCount))
  .catch(error => console.log(error))
})