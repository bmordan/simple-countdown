const moment = require('moment')
const EventEmitter = require('events').EventEmitter
const units = [
  'years',
  'y',
  'months',
  'M',
  'weeks',
  'w',
  'days',
  'd',
  'hours',
  'h',
  'minutes',
  'm',
  'seconds',
  's',
  'milliseconds',
  'ms'
]

class Timer extends EventEmitter {
  constructor (duration) {
    super()

    const isValid = Object.keys(duration)
      .every(unit => (units.indexOf(unit) > -1))

    if (!isValid) throw new Error(`allowed units: ${units.join(', ')}`)

    this.duration = moment.duration(duration)
    this.formattedDuration = this._formatTime('duration')
  }
  start () {
    this.current = this.duration.clone()
    this._startReduce()
    this.emit('start', this._getTimeObj())
  }

  _startReduce () {
    if (!this.current.asMilliseconds()) return this._finishReduce()
    this.current.subtract(1, 'second')
    this.emit('tick', this._getTimeObj())
    setTimeout(() => this._startReduce(), 1000)
  }

  _finishReduce () {
    this.emit('finish', this._getTimeObj())
  }

  _getTimeObj () {
    return {
      duration: this.duration.asMilliseconds(),
      current: this.current.asMilliseconds(),
      formatted: this._formatTime('current'),
      percentage: this._getPercentage()
    }
  }

  _formatTime (type) {
    return ['h', 'm', 's'].map(unit => {
      const u = this[type].get(unit)
      const str = u.toString().substring(0, 2)
      return u < 10 ? `0${str}` : str
    }).join(':')
  }

  _getPercentage () {
    const dur = this.duration.asMilliseconds()
    const cur = this.current.asMilliseconds()
    const diff = dur - cur
    return Math.round(diff / dur * 100)
  }
}

module.exports = Timer
