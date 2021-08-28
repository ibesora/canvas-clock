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
    this.canvasHalfWidth = canvas.width / 2
    this.canvasHalfHeight = canvas.height / 2
    this.circleRadians = Math.PI * 2
    this.clockMode = ClockMode.Regular

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
}

const main = () => {
  const canvas = create2dCanvas()
  const backgroundCanvas = create2dCanvas()
  appendCanvasToDOM(canvas)
  const clockRenderer = new ClockRenderer(canvas, backgroundCanvas)
  clockRenderer.draw()
}

main()
