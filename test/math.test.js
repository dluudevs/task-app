const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit } = require('../src/math')

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

