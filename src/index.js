const app = require('./app')

const port = process.env.PORT
// creates http server instance
app.listen(port, () => {
  console.log('Server is up on', port)
})
