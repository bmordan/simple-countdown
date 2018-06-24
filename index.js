'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var moment = require('moment');
var EventEmitter = require('events').EventEmitter;
var units = ['years', 'y', 'months', 'M', 'weeks', 'w', 'days', 'd', 'hours', 'h', 'minutes', 'm', 'seconds', 's', 'milliseconds', 'ms'];

var Timer = function (_EventEmitter) {
  _inherits(Timer, _EventEmitter);

  function Timer(duration) {
    _classCallCheck(this, Timer);

    var _this = _possibleConstructorReturn(this, (Timer.__proto__ || Object.getPrototypeOf(Timer)).call(this));

    var isValid = Object.keys(duration).every(function (unit) {
      return units.indexOf(unit) > -1;
    });

    if (!isValid) throw new Error('allowed units: ' + units.join(', '));

    _this.duration = moment.duration(duration);
    _this.formattedDuration = _this._formatTime('duration');
    return _this;
  }

  _createClass(Timer, [{
    key: 'start',
    value: function start() {
      this.current = this.duration.clone();
      this._startReduce();
      this.emit('start', this._getTimeObj());
    }
  }, {
    key: '_startReduce',
    value: function _startReduce() {
      var _this2 = this;

      if (!this.current.asMilliseconds()) return this._finishReduce();
      this.current.subtract(1, 'second');
      this.emit('tick', this._getTimeObj());
      setTimeout(function () {
        return _this2._startReduce();
      }, 1000);
    }
  }, {
    key: '_finishReduce',
    value: function _finishReduce() {
      this.emit('finish', this._getTimeObj());
    }
  }, {
    key: '_getTimeObj',
    value: function _getTimeObj() {
      return {
        duration: this.duration.asMilliseconds(),
        current: this.current.asMilliseconds(),
        formatted: this._formatTime('current'),
        percentage: this._getPercentage()
      };
    }
  }, {
    key: '_formatTime',
    value: function _formatTime(type) {
      var _this3 = this;

      return ['h', 'm', 's'].map(function (unit) {
        var u = _this3[type].get(unit);
        var str = u.toString().substring(0, 2);
        return u < 10 ? '0' + str : str;
      }).join(':');
    }
  }, {
    key: '_getPercentage',
    value: function _getPercentage() {
      var dur = this.duration.asMilliseconds();
      var cur = this.current.asMilliseconds();
      var diff = dur - cur;
      return Math.round(diff / dur * 100);
    }
  }]);

  return Timer;
}(EventEmitter);

module.exports = Timer;
