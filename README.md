# simple-countdown

This is a simple countdown timer that emits events.

## Get started

```
npm install
```

## Usage

```js
const Timer = require('simple-countdown')

const timer = new Timer({minutes: 5})

timer.on('start', function (evt) {
  // timer has started
})

timer.on('tick', function (evt) {
  /* evt is an object like this
    {
      duration: 300000,
      current: 292000,
      formatted: '00:04:29',
      percentage: 3
    }
  */
})

timer.on('finish', function (evt) {
  /* evt is an object like this
    {
      duration: 300000,
      current: 0,
      formatted: '00:05:00',
      percentage: 100
    }
  */  
})

// when you are ready start the timer
timer.start()
```

You can use the [`moment.duration`](https://momentjs.com/docs/#/durations/creating/) api to create your intervals:

|Key|Shorthand|
|:--|:--------|
years|y
months|M
weeks|w
days|d
hours|h
minutes|m
seconds|s
milliseconds|ms

```js
new Timer({minutes: 3, seconds: 30}) || new new Timer({m: 3, s: 30})
```
