const fs = require('fs')
const path = require('path')
const Canvas = require('canvas')
const Promise = require('bluebird')
const _ = require('lodash')
const lwip = require('lwip')
const paperSize = require('paper-size')
const paperRulings = require('paper-rulings')

Promise.promisifyAll(lwip)

const defaultConfig = {
  ruling: paperRulings('college', { format: 'decimal', units: 'mm' }),
  printSize: paperSize.getSize('letter'),
  dpiMultiplier: 30,
  lineColor: '#777',
  dotSize: 6,
  outputFolder: path.join(__dirname, 'output')
}

const drawLines = (canvas, ctx, config) => {
  ctx.lineWidth = 1
  ctx.strokeStyle = config.lineColor

  ctx.setLineDash([7, 7])

  const spacing = parseFloat(config.ruling.spacing.split(' ')[0]) * config.dpiMultiplier

  ctx.beginPath()
  for (let y = 1; y <= canvas.height; y += spacing) {
    ctx.moveTo(0, y)
    ctx.lineTo(canvas.width, y)
    ctx.stroke()
  }
  ctx.closePath()
}

const drawLeftMargin = (canvas, ctx, config, double = true) => {
  ctx.lineWidth = 2
  ctx.strokeStyle = config.lineColor

  ctx.setLineDash([7, 7])

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

const drawCenterMargin = (canvas, ctx, config) => {
  ctx.lineWidth = 2
  ctx.strokeStyle = config.lineColor

  const left = canvas.width / 2

  ctx.beginPath()
  ctx.moveTo(left, 0)
  ctx.lineTo(left, canvas.height)
  ctx.stroke()
  ctx.closePath()

  return ctx
}

const drawRightGrid = (canvas, ctx, config) => {
  const left = canvas.width / 2

  const spacing = parseFloat(config.ruling.spacing.split(' ')[0]) * config.dpiMultiplier

  ctx.lineWidth = config.dotSize
  ctx.strokeStyle = config.lineColor

  // draw on the lines
  ctx.setLineDash([config.dotSize, spacing - config.dotSize])
  ctx.beginPath()
  for (let x = left; x <= canvas.width; x += spacing) {
    ctx.moveTo(x, -2)
    ctx.lineTo(x, canvas.height)
    ctx.stroke()
  }
  ctx.closePath()

  // draw between the lines

  ctx.beginPath()
  for (let x = left; x <= canvas.width; x += spacing) {
    ctx.moveTo(x, 0 - (config.dotSize / 2))
    ctx.lineTo(x, canvas.height)
    ctx.stroke()
  }
  ctx.closePath()
}

// const drawGrid = (canvas, ctx) => {
//   ctx.lineWidth = 2
//   ctx.strokeStyle = config.lineColor
//
//   // draw vertical lines
//   ctx.beginPath()
//   for (let x = 0; x <= canvas.width; x += 100) {
//     ctx.moveTo(x, 0)
//     ctx.lineTo(x, canvas.height)
//     ctx.stroke()
//   }
//
//   // draw horizontal lines
//   for (let y = 0; y <= canvas.height; y += 100) {
//     ctx.moveTo(0, y)
//     ctx.lineTo(canvas.width, y)
//     ctx.stroke()
//   }
//   ctx.closePath()
//
//   return ctx
// }

const generatePage = (config = defaultConfig) => {
  const canvasSize = config.printSize.map(x => config.dpiMultiplier * x)
  const canvas = new Canvas(...canvasSize)
  const ctx = canvas.getContext('2d')

  ctx.save()
  drawLines(canvas, ctx, config)
  ctx.restore()

  ctx.save()
  drawLeftMargin(canvas, ctx, config)
  ctx.restore()

  ctx.save()
  drawRightGrid(canvas, ctx, config)
  ctx.restore()

  if (!fs.existsSync(config.outputFolder)){
    fs.mkdirSync(config.outputFolder);
  }
  const outputFile = path.join(config.outputFolder, 'out.png')
  fs.writeFileSync(outputFile, canvas.toBuffer())
}
module.exports = generatePage()

if (!module.parent) {
  generatePage(defaultConfig)
}
