import Clock from './clock'
import { create2dCanvas, appendCanvasToDOM } from './utils'

const main = () => {
  const canvas = create2dCanvas()
  canvas.className = 'main-canvas'
  const backgroundCanvas = create2dCanvas()
  appendCanvasToDOM(canvas)
  const clock = new Clock(canvas, backgroundCanvas)
  clock.draw()
}

main()
