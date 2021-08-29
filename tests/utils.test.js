import { getTimeInMillis, create2dCanvas } from '../src/utils'

const dateMock = {
  getHours: () => { 2 },
  getMinutes: () => { 3 },
  getSeconds: () => { 4 },
  getMilliseconds: () => { 5 }
}

test('Checks correct conversion from date to millis', () => {
  const millis = getTimeInMillis(dateMock)
  expect(millis).toBe(dateMock.getHours()*3600000 + dateMock.getMinutes()*60000 + dateMock.getSeconds()*1000 + dateMock.getMilliseconds())
});

describe('Creates canvas element', () => {
  it('Create canvas with default size', () => {
    const canvas = create2dCanvas()
    expect(canvas.width).toBe(300)
    expect(canvas.height).toBe(300)
  })
  it('Create canvas with custom size', () => {
    const width = 400
    const height = 400
    const canvas = create2dCanvas(width, height)
    expect(canvas.width).toBe(400)
    expect(canvas.height).toBe(400)
  })
})