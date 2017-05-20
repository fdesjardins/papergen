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

const config = {
  ruling: paperRulings('gregg', { format: 'decimal', units: 'mm' }),
  printSize: paperSize.getSize('letter'),
  dpiMultiplier: 30
}

const drawLines = (canvas, ctx) => {
  ctx.lineWidth = 1
  ctx.strokeStyle = '#555'

  const spacing = parseFloat(config.ruling.spacing.split(' ')[0]) * config.dpiMultiplier

  ctx.beginPath()
  for (let y = 0; y <= canvas.height; y += spacing) {
    ctx.moveTo(0, y)
    ctx.lineTo(canvas.width, y)
    ctx.stroke()
  }
  ctx.closePath()
}

const drawLeftMargin = (canvas, ctx, double = true) => {
  ctx.lineWidth = 2
  ctx.strokeStyle = '#000'

  // mm from left edge
  const left = 20 * config.dpiMultiplier
  ctx.beginPath()
  ctx.moveTo(left, 0)
  ctx.lineTo(left, canvas.height)
  ctx.stroke()

  if (double) {
    const left2 = left - (1.5 * config.dpiMultiplier)
    ctx.moveTo(left2, 0)
    ctx.lineTo(left2, canvas.height)
    ctx.stroke()
  }
  ctx.closePath()
}

const drawCenterMargin = (canvas, ctx) => {
  ctx.lineWidth = 2
  ctx.strokeStyle = '#000'

  const left = canvas.width / 2

  ctx.beginPath()
  ctx.moveTo(left, 0)
  ctx.lineTo(left, canvas.height)
  ctx.stroke()
  ctx.closePath()

  return ctx
}

const drawRightGrid = (canvas, ctx) => {
  ctx.lineWidth = 3
  ctx.strokeStyle = '#777'

  const left = canvas.width / 2

  // ctx.setLineDash([20, pxSpacing - 20]);

  const spacing = parseFloat(config.ruling.spacing.split(' ')[0]) * config.dpiMultiplier

  ctx.beginPath()
  for (let x = left; x <= canvas.width; x += spacing) {
    ctx.moveTo(x, 0)
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

if (!module.parent) {
  // const buffer = genNotesPaper()
  // fs.writeFileSync(path.join(__dirname, `out.png`), buffer)
  console.log(config.printSize, config.ruling)
  const canvas = new Canvas(...(config.printSize.map(x => config.dpiMultiplier * x)))
  const ctx = canvas.getContext('2d')

  ctx.save()
  drawLines(canvas, ctx)
  ctx.restore()

  ctx.save()
  drawLeftMargin(canvas, ctx)
  ctx.restore()

  // ctx.save()
  // drawCenterMargin(canvas, ctx)
  // ctx.restore()

  ctx.save()
  drawRightGrid(canvas, ctx)
  ctx.restore()

  fs.writeFileSync('out.png', canvas.toBuffer())
}
