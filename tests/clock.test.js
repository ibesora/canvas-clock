import Clock, { ClockMode } from '../src/clock'

jest.useFakeTimers('legacy')
jest.mock('../src/clock-renderer')

const rendererMock = {
  setStopWatchMillis: jest.fn(),
  resetChangeModeAnimation: jest.fn(),
  draw: jest.fn()
}

document.getElementById = jest.fn().mockReturnValue({
  addEventListener: jest.fn()
})

test('Checks clock initial stat', () => {
  const clock = new Clock(null, null)
  expect(clock.state.clockMode).toBe(ClockMode.Regular)
  expect(clock.state.stopWatchMillis).toBe(0)
  expect(clock.state.isStopWatchRunning).toBe(false)
})

test('Pauses stopwatch', () => {
  const clock = new Clock(null, null)
  clock.state.isStopWatchRunning = true
  expect(clock.state.isStopWatchRunning).toBe(true)
  clock.pauseStopWatch()
  expect(clock.state.isStopWatchRunning).toBe(false)
  expect(clearInterval).toHaveBeenCalled()
});

test('Starts stopwatch', () => {
  const clock = new Clock(null, null)
  clock.renderer = rendererMock
  clock.startStopWatch()
  expect(clock.state.isStopWatchRunning).toBe(true)
  jest.runOnlyPendingTimers()
  expect(clock.state.stopWatchMillis).toBe(clock.stopWatchIntervalMillis)
});

test('Reset stopwatch', () => {
  const clock = new Clock(null, null)
  clock.renderer = rendererMock
  clock.startStopWatch()
  clock.resetStopWatch()
  expect(clock.state.isStopWatchRunning).toBe(false)
  expect(clearInterval).toHaveBeenCalled()
  expect(clock.state.clockMode).toBe(ClockMode.ResettingStopWatch)
  expect(rendererMock.resetChangeModeAnimation).toHaveBeenCalled()
});

test('Switch mode to stopwatch', () => {
  const clock = new Clock(null, null)
  clock.renderer = rendererMock
  clock.switchModeToStopWatch()
  expect(clock.state.clockMode).toBe(ClockMode.RegularToStopWatch)
  expect(rendererMock.resetChangeModeAnimation).toHaveBeenCalled()
});

test('Switch mode to regular', () => {
  const clock = new Clock(null, null)
  clock.renderer = rendererMock
  clock.switchModeToRegular()
  expect(clock.state.clockMode).toBe(ClockMode.StopWatchToRegular)
  expect(rendererMock.resetChangeModeAnimation).toHaveBeenCalled()
});

test('Draw', () => {
  const clock = new Clock(null, null)
  clock.renderer = rendererMock
  clock.draw()
  expect(rendererMock.draw).toHaveBeenCalled()
});
