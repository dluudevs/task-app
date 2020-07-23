const jwt = require('jsonwebtoken')
const User = require('../models/user')

// this function serves as a middleware function, hence why next() is called at the end of it
// this function must be passed a second argument to the routers defined user routers
// authentication forces users to login before they can perform certain tasks like deleting their own profile or reading their own profile
const auth = async (req, res, next) => {
  try {
    // if no header with authorization found, replace wont work. the error will be caught by the catch method
    // be mindful of the space in replace method, this is how the value is stored in the header
    const token = req.header('Authorization').replace('Bearer ', '')
    // returns payload (user) if token is valid, returned user will have ID property because in mongoose middleware (jwt.sign)
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // find by user id and token, as token will have to be deleted when user logs out
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token  })
    
    if (!user){
      // throw error to trigger catch if no user found
      throw new Error() 
    }
    // stores the located user and token in request variable so route handler callback can access these values  - is this why middleware is used?
    req.token = token
    req.user = user
    // otherwise call route handler function
    next()
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.' })
  }
}

module.exports = auth