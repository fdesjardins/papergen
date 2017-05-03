const fs = require('fs')
const path = require('path')
const Canvas = require('canvas')
const Promise = require('bluebird')
const _ = require('lodash')
const lwip = require('lwip')
const paperSize = require('paper-size')
const paperRulings = require('paper-rulings')

Promise.promisifyAll(lwip)

//
// const drawLines = (ctx, {spacing, thickness, color}) => {
//   return
// }

const drawLines = (canvas, ctx) => {
  ctx.lineWidth = 2
  ctx.strokeStyle = '#555'

  ctx.setLineDash([10, 10]);

  // px to mm
  const pxSpacing = (canvas.height * 25.4) / 1000

  ctx.beginPath()
  for (let y = 0; y <= canvas.height; y += pxSpacing) {
    ctx.moveTo(0, y)
    ctx.lineTo(canvas.width, y)
    ctx.stroke()
  }
  ctx.closePath()
}

const drawLeftMargin = (canvas, ctx, double = true) => {
  ctx.lineWidth = 2
  ctx.strokeStyle = '#000'

  // prints to 21cm across; we want 2.5 cm from left
  const left1 = 1.75 * 6000 / 21
  const left2 = 1.625 * 6000 / 21

  ctx.setLineDash([10, 10]);

  ctx.beginPath()
  ctx.moveTo(left1, 0)
  ctx.lineTo(left1, canvas.height)
  ctx.stroke()

  if (double) {
    ctx.moveTo(left2, 0)
    ctx.lineTo(left2, canvas.height)
    ctx.stroke()
  }
  ctx.closePath()
}

const drawCenterMargin = (canvas, ctx) => {
  ctx.lineWidth = 2
  ctx.strokeStyle = '#000'

  const left1 = 2.75 * 6000 / 21

  ctx.beginPath()
  ctx.moveTo(left1 + (canvas.width - left1) / 3, 0)
  ctx.lineTo(left1 + (canvas.width - left1) / 3, canvas.height)
  ctx.stroke()
  ctx.closePath()
  // ctx.strokeStyle = '#555'
  // ctx.moveTo(left1 + (canvas.width - left1) / 3 * 2, 0)
  // ctx.lineTo(left1 + (canvas.width - left1) / 3 * 2, canvas.height)
  // ctx.stroke()

  return ctx
}

const drawRightGrid = (canvas, ctx) => {
  ctx.lineWidth = 3
  ctx.strokeStyle = '#000'

  const left1 = 1.75 * 6000 / 21

  const margin = left1 + (canvas.width - left1) / 2 - 5

  const pxSpacing = (canvas.height * 25.4) / 1000

  ctx.setLineDash([20, pxSpacing - 20]);

  ctx.beginPath()
  for (let x = margin; x <= canvas.width - pxSpacing; x += pxSpacing) {
    ctx.moveTo(x, -10)
    ctx.lineTo(x, canvas.height)
    ctx.stroke()
  }
  ctx.closePath()
}

const drawGrid = (canvas, ctx) => {
  ctx.lineWidth = 2
  ctx.strokeStyle = '#000'

  // draw vertical lines
  ctx.beginPath()
  for (let x = 0; x <= canvas.width; x += 100) {
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvas.height)
    ctx.stroke()
  }

  // draw horizontal lines
  for (let y = 0; y <= canvas.height; y += 100) {
    ctx.moveTo(0, y)
    ctx.lineTo(canvas.width, y)
    ctx.stroke()
  }
  ctx.closePath()

  return ctx
}

const genNotesPaper = () => {
  const canvas = new Canvas(6000, 9000)
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.save()
  drawLines(canvas, ctx)
  ctx.restore()
  ctx.save()
  drawRightGrid(canvas, ctx)
  ctx.restore()
  ctx.save()
  drawLeftMargin(canvas, ctx)
  ctx.restore()
  // ctx.save()
  // drawCenterMargin(canvas)
  // ctx.restore()

  return canvas.toBuffer()
}

const genGraphPaper = () => {
  const canvas = new Canvas(6000, 9000)
  drawGrid(canvas)
  return canvas.toBuffer()
}

if (!module.parent) {
  const buffer = genNotesPaper()
  fs.writeFileSync(path.join(__dirname, `out.png`), buffer)
}
