const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add } = require('../src/math')

test('should calculate total with tip', () => {
  const total = calculateTip(10, 0.3)
  expect(total).toBe(13)
})

test('should calculate total with default tip', () => {
  const total = calculateTip(10)
  expect(total).toBe(12)
})

test('should convert fahrenheit to celsius correctly', () => {
  const celsius = fahrenheitToCelsius(32)
  expect(celsius).toBe(0)
})

test('should convert celsius to fahrenheit', () => {
  const fahrenheit = celsiusToFahrenheit(0)
  expect(fahrenheit).toBe(32)
})

// pass in done parameter and call it so Jest knows async process has finished
// test('Async test demo', (done) => {
//   setTimeout(() => {
//     expect(1).toBe(2)
//     done()
//   }, 2000)
// })

test('Should add two numbers', (done) => {
  add(2,3).then((sum) => {
    expect(sum).toBe(5)
    done()
  })
})

// async functions always return a promise. jest will wait for returned promise to be fulfilled or rejected before 
// determining if test case is a success or failure
test('should add two numbers async await', async () => {
  const sum = await add(10, 22)
  expect(sum).toBe(32)
})

