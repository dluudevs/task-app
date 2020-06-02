const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
  try {
    // if no header with authorization found, replace wont work. the error will be caught by the catch method
    // be mindful of the space in replace method, this is how the value is stored in the header
    const token = req.header('Authorization').replace('Bearer ', '')
    // returns payload (user) if token is valid
    const decoded = jwt.verify(token, 'thisismynewcourse')
    // find by user id and token, as token will have to be deleted when user logs out
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token  })
    if (!user){
      // throw error to trigger catch if no user found
      throw new Error() 
    }
    // stores the located user so route handler does not need to find user again
    req.user = user
    // otherwise call route handler function
    next()
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.' })
  }
}

module.exports = auth