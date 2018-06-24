/* global jest test expect */
const Timer = require('../src/main')

test('should be able to start a timer with a duration', function () {
  const timer = new Timer({seconds: 2})
  expect(timer.duration.asMilliseconds()).toBe(2000)
  expect(timer.formattedDuration).toBe('00:00:02')
})

test('should validate its arguments', function () {
  function timer () {
    return new Timer({wrong: 2})
  }
  expect(timer).toThrowError('allowed units: years, y, months, M, weeks, w, days, d, hours, h, minutes, m, seconds, s, milliseconds, ms')
})

test('should be able to start a timer with a compound duration', function () {
  const timer = new Timer({m: 1, s: 30})
  expect(timer.duration.asMilliseconds()).toBe(90000)
})

test('should emit a start event', function () {
  const timer = new Timer({seconds: 2})
  const handler = jest.fn()
  timer.on('start', handler)
  expect(handler).toHaveBeenCalledTimes(0)
  timer.start()
  expect(handler).toHaveBeenCalledTimes(1)
})

test('should count down once started and finish', function (done) {
  const timer = new Timer({seconds: 2})
  const handler = jest.fn()
  timer.on('tick', handler)
  timer.on('finish', () => {
    expect(handler).toHaveBeenCalledTimes(2)
    done()
  })

  timer.start()
})

test('tick will return a time object', function (done) {
  const timer = new Timer({seconds: 2})
  const handler = jest.fn()
  const calledWith = {
    duration: 2000,
    current: 0,
    formatted: '00:00:00',
    percentage: 100
  }
  timer.on('tick', handler)
  timer.on('finish', () => {
    expect(handler).toHaveBeenLastCalledWith(calledWith)
    done()
  })

  timer.start()
})
