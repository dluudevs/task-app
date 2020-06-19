// these mock functions don't return anything because inside of account.js we don't do anything with their returned value.
// these functions are simply called - by saving this file in this file structure the test will look for the module in the __mocks__ folder
module.exports = {
  setApiKey(){

  },
  send(){

  }
}