// Configuration options
const canvasMargin = 10
const outerCircleStrokeColor = '#92949C'
const centerCircleRadius = 2
const centerCircleLineWidth = 3
const centerCircleStrokeColor = '#0C3D4A'
const centerCircleFillColor = '#353535'
const hourMarkLength = 10
const hourMarkWidth = 2
const hourMarkColor = '#466B76'
const hoursHandleToWatchRadiusRatio = 0.7
const hoursHandleWidth = 2
const hoursHandleColor = '#000000'
const minutesMarkLength = 5
const minutesMarkWidth = 1
const minutesMarkColor = '#C4D1D5'
const minutesHandleWidth = 0.8
const minutesHandleToWatchRadiusRatio = 0.8
const minutesHandleColor = '#000000'
const secondsHandleWidth = 0.5
const secondsHandleToWatchRadiusRatio = 0.9
const secondsHandleColor = '#ff0000'
const secondsTailToWatchRadiusRatio = 0.1

const create2dCanvas = (width = 300, height = 300) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

const appendCanvasToDOM = (canvas) => {
  document.body.appendChild(canvas)
}

const ClockMode = {
  Regular: 0,
  StopWatch: 1
}

class ClockRenderer {
  constructor(canvas, backgroundCanvas) {
    this.canvas = canvas
    this.backgroundCanvas = backgroundCanvas
    this.ctx = canvas.getContext('2d')
    this.backgroundCtx = backgroundCanvas.getContext('2d')
    this.regularModeIcon = document.getElementById('regular-mode-icon')
    this.stopWatchModeIcon = document.getElementById('stopwatch-mode-icon')
    this.canvasHalfWidth = canvas.width / 2
    this.canvasHalfHeight = canvas.height / 2
    this.circleRadians = Math.PI * 2
    this.clockMode = ClockMode.Regular
    this.stopWatchMillis = 0
    this.stopWatchIntervalMillis = 10
    this.isStopWatchRunning = false
    this.stopWatchIntervalId = null

    this.renderBackgroundToOffscreenCanvas()
  }

  renderBackgroundToOffscreenCanvas() {
    this.renderCirclesToBackgroundCanvas()
    this.renderMarksToBackgroundCanvas()
    this.renderKnobs()
  }

  renderCirclesToBackgroundCanvas() {
    this.renderCircles(this.backgroundCtx)
  }

  renderCircles(ctx) {
    ctx.clearRect(0, 0, this.backgroundCanvas.width, this.backgroundCanvas.height)
    ctx.arc(this.canvasHalfWidth, this.canvasHalfHeight, Math.min(this.canvasHalfWidth,
      this.canvasHalfHeight) - canvasMargin, 0, this.circleRadians)
    ctx.strokeStyle = outerCircleStrokeColor
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(this.canvasHalfWidth, this.canvasHalfHeight, centerCircleRadius, 0, this.circleRadians)
    ctx.lineWidth = centerCircleLineWidth
    ctx.fillStyle = centerCircleFillColor
    ctx.strokeStyle = centerCircleStrokeColor
    ctx.stroke()
  }

  renderMarksToBackgroundCanvas() {
    this.renderMarks(this.backgroundCtx)
  }

  renderMarks(ctx) {
    const outerRadius = Math.min(this.canvasHalfWidth, this.canvasHalfHeight) - canvasMargin
    for (let i = 0; i < 60; ++i) {
      if (i % 5 === 0) {
        const angle = this.computeCircleAngle(i, 12)
        this.renderMark(ctx, angle, outerRadius, hourMarkLength, hourMarkWidth, hourMarkColor)
      } else {
        const angle = this.computeCircleAngle(i, 60)
        this.renderMark(ctx, angle, outerRadius, minutesMarkLength, minutesMarkWidth,
          minutesMarkColor)
      }
    }
  }

  computeCircleAngle(index, total, offset = 0) {
    return (this.circleRadians * (index / total)) - offset
  }

  renderMark(ctx, angle, outerStart, length, lineWidth, color) {
    const angleSin = Math.sin(angle)
    const angleCos = Math.cos(angle)
    const x1 = this.canvasHalfWidth + angleCos * outerStart
    const y1 = this.canvasHalfHeight + angleSin * outerStart
    const x2 = this.canvasHalfWidth + angleCos * (outerStart - length)
    const y2 = this.canvasHalfHeight + angleSin * (outerStart - length)

    ctx.lineWidth = lineWidth
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.strokeStyle = color
    ctx.stroke()
  }

  renderKnobs() {

  }

  draw(step) {
    this.clear()
    this.drawBackground()
    this.drawForeground(step)
    requestAnimationFrame((frameStep) => this.draw(frameStep))
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  drawBackground() {
    this.ctx.drawImage(this.backgroundCanvas, 0, 0)
  }

  drawForeground(step) {
    this.drawHandles(step)
  }

  drawHandles(step) {
    if (this.clockMode === ClockMode.Regular) {
      this.renderRegularModeHandles()
    }
    else if (this.clockMode === ClockMode.StopWatch) this.renderStopWatchModeHandles(this.stopWatchMillis)
  }

  renderRegularModeHandles() {
    const currentTimeMillis = this.getCurrentTimeInMillis()
    const {
      hoursHandValue,
      minutesHandValue,
      secondsHandValue
    } = this.getRegularModeHandsValuesFromMillis(currentTimeMillis)
    this.renderHandles(hoursHandValue, minutesHandValue, secondsHandValue)
  }

  getCurrentTimeInMillis() {
    const date = new Date()
    const millisInASecond = 1000
    const secondsInAMinute = 60
    const minutesInAnHour = 60
    const millisInAMinute = secondsInAMinute * millisInASecond
    const millisInAnHour = minutesInAnHour * millisInAMinute
    return date.getHours() * millisInAnHour
      + date.getMinutes() * millisInAMinute
      + date.getSeconds() * millisInASecond
      + date.getMilliseconds()
  }

  getRegularModeHandsValuesFromMillis(millis) {
    // In regular mode the hour, minute and second hands
    // are the hour, minute and seconds values
    const minutesInAnHour = 60
    const secondsInAMinute = 60
    const secondsInAnHour = minutesInAnHour * secondsInAMinute
    const millisInASecond = 1000
    let secondsHandValue = millis / millisInASecond
    const hoursHandValue = secondsHandValue / secondsInAnHour
    secondsHandValue %= secondsInAnHour
    const minutesHandValue = secondsHandValue / secondsInAMinute
    secondsHandValue %= secondsInAMinute
    return { hoursHandValue, minutesHandValue, secondsHandValue }
  }

  renderHandles(hours, minutes, seconds) {
    const clockRadius = this.canvasHalfWidth
    const quarterCircleAngle = this.circleRadians / 4
    const secondsAngle = this.computeCircleAngle(seconds, 60, quarterCircleAngle)
    const minutesAngle = this.computeCircleAngle(minutes, 60, quarterCircleAngle)
    const hoursAngle = this.computeCircleAngle(hours, 12, quarterCircleAngle)
    this.renderHandle(secondsAngle, clockRadius * secondsHandleToWatchRadiusRatio,
      secondsHandleWidth, secondsHandleColor, clockRadius * secondsTailToWatchRadiusRatio)
    this.renderHandle(minutesAngle, clockRadius * minutesHandleToWatchRadiusRatio,
      minutesHandleWidth, minutesHandleColor)
    this.renderHandle(hoursAngle, clockRadius * hoursHandleToWatchRadiusRatio,
      hoursHandleWidth, hoursHandleColor)
  }

  renderHandle(angle, handleLength, handleWidth, handleColor, tailLength = 0) {
    const angleSin = Math.sin(angle)
    const angleCos = Math.cos(angle)
    this.ctx.lineWidth = handleWidth
    this.ctx.beginPath()
    this.ctx.moveTo(this.canvasHalfWidth, this.canvasHalfHeight)
    this.ctx.lineTo((this.canvasHalfWidth + angleCos * handleLength),
      this.canvasHalfHeight + angleSin * handleLength)
    this.ctx.moveTo(this.canvasHalfWidth, this.canvasHalfHeight)
    this.ctx.lineTo((this.canvasHalfWidth - angleCos * tailLength),
      this.canvasHalfHeight - angleSin * tailLength)
    this.ctx.strokeStyle = handleColor
    this.ctx.stroke()
  }

  renderStopWatchModeHandles (millis) { 
    const { hoursHandValue, minutesHandValue, secondsHandValue } = this.getStopWatchModeHandsValuesFromMillis(millis)
    this.renderHandles(hoursHandValue, minutesHandValue, secondsHandValue)
  }

  getStopWatchModeHandsValuesFromMillis (millis) {
    // In stopwatch mode the hour, minute and second hands
    // are the minute, seconds and deciseconds values
    // This means we need to account for differences between
    // angles i.e. a whole lap of the seconds hand should be
    // 10 deciseconds instead of 60 seconds. Similarly, a whole lap of the hour hand
    // should be 60 seconds instead of 12 hours
    const millisecondsInADecisecond = 100
    const decisecondsToSecondsAngleMapping = 60 / 10
    const minutesToHoursAngleMapping = 60 / 12
    const secondsHandValue = ((millis / millisecondsInADecisecond) * decisecondsToSecondsAngleMapping) % 60
    const { minutesHandValue, secondsHandValue: secondsValue } = this.getRegularModeHandsValuesFromMillis(millis)
    return { hoursHandValue: minutesHandValue / minutesToHoursAngleMapping, minutesHandValue: secondsValue, secondsHandValue}
  }

  pauseStopWatch () {
    this.isStopWatchRunning = false
    clearInterval(this.stopWatchIntervalId)
  }

  startStopWatch () {
    this.isStopWatchRunning = true
    this.stopWatchIntervalId = setInterval(() => this.increaseMillis(), this.stopWatchIntervalMillis)
  }

  increaseMillis () {
    this.stopWatchMillis += this.stopWatchIntervalMillis
  }

  resetStopWatch () {
    this.pauseStopWatch()
    this.stopWatchMillis = 0
  }

  switchModeToStopWatch () {
    this.clockMode = ClockMode.StopWatch
    this.switchModeIcons()
  }

  switchModeIcons () {
    const elementToEnable = this.clockMode === ClockMode.StopWatch
      ? this.stopWatchModeIcon
      : this.regularModeIcon 
    const elementToDisable = this.clockMode === ClockMode.StopWatch
      ? this.regularModeIcon
      : this.stopWatchModeIcon
    elementToEnable.classList.add("active")
    elementToDisable.classList.remove("active")
  }

  switchModeToRegular () {
    this.clockMode = ClockMode.Regular
    this.switchModeIcons()
  }

}

const main = () => {
  const canvas = create2dCanvas()
  canvas.className = 'main-canvas'
  const backgroundCanvas = create2dCanvas()
  appendCanvasToDOM(canvas)
  const clockRenderer = new ClockRenderer(canvas, backgroundCanvas)
  document.body.addEventListener('keyup', (e) => {
    if (e.key === ' ') {
      if (clockRenderer.clockMode === ClockMode.StopWatch && clockRenderer.isStopWatchRunning) clockRenderer.pauseStopWatch()
      else if (clockRenderer.clockMode === ClockMode.StopWatch && !clockRenderer.isStopWatchRunning) clockRenderer.startStopWatch()
    } else if (clockRenderer.clockMode === ClockMode.StopWatch && e.key === 'Enter') {
      clockRenderer.resetStopWatch()
    } else if (e.key === 'ArrowRight' && clockRenderer.clockMode === ClockMode.Regular) clockRenderer.switchModeToStopWatch()
    else if (e.key === 'ArrowLeft' && clockRenderer.clockMode === ClockMode.StopWatch) clockRenderer.switchModeToRegular()
  })
  clockRenderer.draw()
}

main()
