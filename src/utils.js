export const create2dCanvas = (width = 300, height = 300) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

export const appendCanvasToDOM = (canvas) => {
  document.body.appendChild(canvas)
}

export const getCurrentTimeInMillis = () => {
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

export const easeInOutCubic = (x) => {
  // This code is from https://easings.net/#easeInOutCubic
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}