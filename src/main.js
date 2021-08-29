// Configuration options
const CanvasMargin = 10
const OuterCircleStrokeColor = '#92949C'
const CenterCircleRadius = 2
const CenterCircleLineWidth = 3
const CenterCircleStrokeColor = '#0C3D4A'
const CenterCircleFillColor = '#353535'
const HourMarkLength = 10
const HourMarkWidth = 2
const HourMarkColor = '#466B76'
const HoursHandleToWatchRadiusRatio = 0.7
const HoursHandleWidth = 2
const HoursHandleColor = '#000000'
const MinutesMarkLength = 5
const MinutesMarkWidth = 1
const MinutesMarkColor = '#C4D1D5'
const MinutesHandleWidth = 0.8
const MinutesHandleToWatchRadiusRatio = 0.8
const MinutesHandleColor = '#000000'
const SecondsHandleWidth = 0.5
const SecondsHandleToWatchRadiusRatio = 0.9
const SecondsHandleColor = '#ff0000'
const SecondsTailToWatchRadiusRatio = 0.1
const CangeModeAnimationDurationMillis = 500

const create2dCanvas = (width = 300, height = 300) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

const appendCanvasToDOM = (canvas) => {
  document.body.appendChild(canvas)
}

const easeInOutCubic = (x) => {
  // This code is from https://easings.net/#easeInOutCubic
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

const ClockMode = {
  Regular: 0,
  StopWatch: 1,
  StopWatchToRegular: 2,
  RegularToStopWatch: 3,
  ResettingStopWatch: 4
}

class ClockRenderer {
  constructor(canvas, backgroundCanvas) {
    this.canvas = canvas
    this.backgroundCanvas = backgroundCanvas
    this.ctx = canvas.getContext('2d')
    this.backgroundCtx = backgroundCanvas.getContext('2d')
    this.regularModeIcon = document.getElementById('regular-mode-icon')
    this.stopWatchModeIcon = document.getElementById('stopwatch-mode-icon')
    this.topButton = document.getElementById('top-button')
    this.middleButton = document.getElementById('middle-button')
    this.bottomButton = document.getElementById('bottom-button')
    this.canvasHalfWidth = canvas.width / 2
    this.canvasHalfHeight = canvas.height / 2
    this.circleRadians = Math.PI * 2
    this.clockMode = ClockMode.Regular
    this.stopWatchMillis = 0
    this.stopWatchIntervalMillis = 10
    this.isStopWatchRunning = false
    this.stopWatchIntervalId = null
    this.changeModeAnimationStart = 0

    this.addEventListeners()
    this.renderBackgroundToOffscreenCanvas()
  }

  addEventListeners() {
    this.topButton.addEventListener('click', () => {
      if (this.clockMode === ClockMode.StopWatch && this.isStopWatchRunning) this.pauseStopWatch()
      else if (this.clockMode === ClockMode.StopWatch && !this.isStopWatchRunning) this.startStopWatch()
    })
    this.middleButton.addEventListener('click', () => {
      if (this.clockMode === ClockMode.Regular) this.switchModeToStopWatch()
      else if (this.clockMode === ClockMode.StopWatch) this.switchModeToRegular()
      this.switchModeIcons()
    })
    this.bottomButton.addEventListener('click', () => {
      if (this.clockMode === ClockMode.StopWatch) {
        this.resetStopWatch()
      }
    })
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
    this.changeModeAnimationStart = 0
    this.clockMode = ClockMode.ResettingStopWatch
  }

  switchModeToStopWatch () {
    this.clockMode = ClockMode.RegularToStopWatch
    this.changeModeAnimationStart = 0
  }

  switchModeIcons () {
    const elementToEnable = this.clockMode === ClockMode.RegularToStopWatch
      ? this.stopWatchModeIcon
      : this.regularModeIcon 
    const elementToDisable = this.clockMode === ClockMode.RegularToStopWatch
      ? this.regularModeIcon
      : this.stopWatchModeIcon
    elementToEnable.classList.add("active")
    elementToDisable.classList.remove("active")
  }

  switchModeToRegular () {
    this.clockMode = ClockMode.StopWatchToRegular
    this.changeModeAnimationStart = 0
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
      this.canvasHalfHeight) - CanvasMargin, 0, this.circleRadians)
    ctx.strokeStyle = OuterCircleStrokeColor
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(this.canvasHalfWidth, this.canvasHalfHeight, CenterCircleRadius, 0, this.circleRadians)
    ctx.lineWidth = CenterCircleLineWidth
    ctx.fillStyle = CenterCircleFillColor
    ctx.strokeStyle = CenterCircleStrokeColor
    ctx.stroke()
  }

  renderMarksToBackgroundCanvas() {
    this.renderMarks(this.backgroundCtx)
  }

  renderMarks(ctx) {
    const outerRadius = Math.min(this.canvasHalfWidth, this.canvasHalfHeight) - CanvasMargin
    for (let i = 0; i < 60; ++i) {
      if (i % 5 === 0) {
        const angle = this.computeCircleAngle(i, 12)
        this.renderMark(ctx, angle, outerRadius, HourMarkLength, HourMarkWidth, HourMarkColor)
      } else {
        const angle = this.computeCircleAngle(i, 60)
        this.renderMark(ctx, angle, outerRadius, MinutesMarkLength, MinutesMarkWidth,
          MinutesMarkColor)
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
    else if (this.clockMode === ClockMode.RegularToStopWatch || this.clockMode === ClockMode.StopWatchToRegular) this.renderModeChangeAnimation(step)
    else if (this.clockMode === ClockMode.ResettingStopWatch) this.renderResetStopWatch(step)
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
    this.renderHandle(secondsAngle, clockRadius * SecondsHandleToWatchRadiusRatio,
      SecondsHandleWidth, SecondsHandleColor, clockRadius * SecondsTailToWatchRadiusRatio)
    this.renderHandle(minutesAngle, clockRadius * MinutesHandleToWatchRadiusRatio,
      MinutesHandleWidth, MinutesHandleColor)
    this.renderHandle(hoursAngle, clockRadius * HoursHandleToWatchRadiusRatio,
      HoursHandleWidth, HoursHandleColor)
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

  renderModeChangeAnimation (step) {
    if (this.changeModeAnimationStart === 0) this.changeModeAnimationStart = step
    else {
      const { handsStartValues, handsEndValues } = this.getAnimValues()
      const shouldEndAnimation = this.renderAnimationModeHandles(step, handsStartValues, handsEndValues)
      if (shouldEndAnimation) {
        if(this.clockMode === ClockMode.RegularToStopWatch) this.clockMode = ClockMode.StopWatch
        else if (this.clockMode === ClockMode.StopWatchToRegular) this.clockMode = ClockMode.Regular
      }
    }
  }

  getAnimValues () {
    const nowInMillis = this.getCurrentTimeInMillis()
    const { hoursHandValue: rH, minutesHandValue: rM, secondsHandValue: rS } = this.getRegularModeHandsValuesFromMillis(nowInMillis)
    const { hoursHandValue: sH, minutesHandValue: sM, secondsHandValue: sS } = this.getStopWatchModeHandsValuesFromMillis(this.stopWatchMillis)
    let sourceSecondsHandValue, targetSecondsHandValue
    let sourceMinutesHandValue, targetMinutesHandValue
    let sourceHoursHandValue, targetHoursHandValue
    if (this.clockMode === ClockMode.RegularToStopWatch) {
      sourceSecondsHandValue = rS; sourceMinutesHandValue = rM; sourceHoursHandValue = rH
      targetSecondsHandValue = sS; targetMinutesHandValue = sM; targetHoursHandValue = sH
    } else {
      sourceSecondsHandValue = sS; sourceMinutesHandValue = sM; sourceHoursHandValue = sH
      targetSecondsHandValue = rS; targetMinutesHandValue = rM; targetHoursHandValue = rH
    }
    // If the target value is less than the source one, we add the needed amount
    // We don't want our clock hands going backward!
    targetSecondsHandValue = targetSecondsHandValue < sourceSecondsHandValue ? targetSecondsHandValue + 60 : targetSecondsHandValue
    targetMinutesHandValue = targetMinutesHandValue < sourceMinutesHandValue ? targetMinutesHandValue + 60 : targetMinutesHandValue
    targetHoursHandValue = targetHoursHandValue % 12
    targetHoursHandValue = targetHoursHandValue < sourceHoursHandValue ? sourceHoursHandValue < 12 ? targetHoursHandValue + 12 : targetHoursHandValue + 24 : targetHoursHandValue
    return {
      handsStartValues: {
        hours: sourceHoursHandValue,
        minutes: sourceMinutesHandValue,
        seconds: sourceSecondsHandValue
      },
      handsEndValues: {
        hours: targetHoursHandValue,
        minutes: targetMinutesHandValue,
        seconds: targetSecondsHandValue
      }
    }
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

  renderAnimationModeHandles(step, handsStartValues, handsEndValues) {
    const animDuration = step - this.changeModeAnimationStart
    const animProgress = animDuration / CangeModeAnimationDurationMillis
    if (animProgress >= 1) return true
    else {
      const mappedProgress = easeInOutCubic(animProgress)
      const hoursHandValue = this.interpolateValue(mappedProgress, handsStartValues.hours, handsEndValues.hours)      
      const minutesHandValue = this.interpolateValue(mappedProgress, handsStartValues.minutes, handsEndValues.minutes)      
      const secondsHandValue = this.interpolateValue(mappedProgress, handsStartValues.seconds, handsEndValues.seconds)
      this.renderHandles(hoursHandValue, minutesHandValue, secondsHandValue)
    }
    return false
  }

  interpolateValue(progress, startValue, endValue) {
    return startValue + (endValue - startValue) * progress
  }

  renderResetStopWatch (step) {
    if (this.changeModeAnimationStart === 0) this.changeModeAnimationStart = step
    else {
      const { hoursHandValue: sH, minutesHandValue: sM, secondsHandValue: sS } = this.getStopWatchModeHandsValuesFromMillis(this.stopWatchMillis)
      const handsStartValues = { hours: sH % 60, minutes: sM % 60, seconds: sS % 60 }
      const handsEndValues = this.stopWatchMillis === 0 ? { hours: 0, minutes: 0, seconds: 0} : { hours: 12, minutes: 60, seconds: 60 }
      const shouldEndAnimation = this.renderAnimationModeHandles(step, handsStartValues, handsEndValues)
      if (shouldEndAnimation) {
        this.clockMode = ClockMode.StopWatch
        this.stopWatchMillis = 0
      }
    }
  }

}

const main = () => {
  const canvas = create2dCanvas()
  canvas.className = 'main-canvas'
  const backgroundCanvas = create2dCanvas()
  appendCanvasToDOM(canvas)
  const clockRenderer = new ClockRenderer(canvas, backgroundCanvas)
  clockRenderer.draw()
}

main()
