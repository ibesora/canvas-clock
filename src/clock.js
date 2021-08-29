import ClockRenderer from './clock-renderer'

export const ClockMode = {
  Regular: 0,
  StopWatch: 1,
  StopWatchToRegular: 2,
  RegularToStopWatch: 3,
  ResettingStopWatch: 4
}

class Clock {
  constructor(canvas, backgroundCanvas) {
    this.state = {
      clockMode: ClockMode.Regular,
      stopWatchMillis: 0,
      isStopWatchRunning: false
    }
    this.renderer = new ClockRenderer(canvas, backgroundCanvas, this.state)
    this.topButton = document.getElementById('top-button')
    this.middleButton = document.getElementById('middle-button')
    this.bottomButton = document.getElementById('bottom-button')
    this.stopWatchIntervalMillis = 10
    this.stopWatchIntervalId = null

    this.addEventListeners()
  }

  addEventListeners() {
    this.topButton.addEventListener('click', () => {
      if (this.state.clockMode === ClockMode.StopWatch && this.state.isStopWatchRunning) this.pauseStopWatch()
      else if (this.state.clockMode === ClockMode.StopWatch && !this.state.isStopWatchRunning) this.startStopWatch()
    })
    this.middleButton.addEventListener('click', () => {
      if (this.state.clockMode === ClockMode.Regular) this.switchModeToStopWatch()
      else if (this.state.clockMode === ClockMode.StopWatch) this.switchModeToRegular()
      this.renderer.switchModeIcons()
    })
    this.bottomButton.addEventListener('click', () => {
      if (this.state.clockMode === ClockMode.StopWatch) {
        this.resetStopWatch()
      }
    })
  }

  pauseStopWatch () {
    this.state.isStopWatchRunning = false
    clearInterval(this.stopWatchIntervalId)
  }

  startStopWatch () {
    this.state.isStopWatchRunning = true
    this.stopWatchIntervalId = setInterval(() => this.increaseMillis(), this.stopWatchIntervalMillis)
  }

  increaseMillis () {
    this.state.stopWatchMillis += this.stopWatchIntervalMillis
    this.renderer.setStopWatchMillis(this.stopWatchMillis)
  }

  resetStopWatch () {
    this.pauseStopWatch()
    this.state.clockMode = ClockMode.ResettingStopWatch
    this.renderer.resetChangeModeAnimation()
  }

  switchModeToStopWatch () {
    this.state.clockMode = ClockMode.RegularToStopWatch
    this.renderer.resetChangeModeAnimation()
  }

  switchModeToRegular () {
    this.state.clockMode = ClockMode.StopWatchToRegular
    this.renderer.resetChangeModeAnimation()
  }

  draw () {
    this.renderer.draw()
  }

}

export default Clock