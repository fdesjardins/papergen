const fs = require('fs')
const path = require('path')
const Canvas = require('canvas')
const Promise = require('bluebird')
const lwip = require('lwip')
const paperSize = require('paper-size')
const paperRulings = require('paper-rulings')
const papergen = require('./lib/papergen')

Promise.promisifyAll(lwip)

const defaultConfig = {
  ruling: paperRulings('college', { format: 'decimal', units: 'mm' }),
  printSize: paperSize.getSize('letter'),
  dpiMultiplier: 30,
  lineColor: '#777',
  dotSize: 6,
  outputFolder: path.join(__dirname, 'output')
}

const generatePage = config => {
  config = Object.assign({}, defaultConfig, config)

  if (typeof config.ruling === 'string') {
    config.ruling = paperRulings(config.ruling)
  }
  if (typeof config.printSize === 'string') {
    config.printSize = paperSize.getSize(config.printSize)
  }

  const canvasSize = config.printSize.map(x => config.dpiMultiplier * x)
  const canvas = new Canvas(...canvasSize)
  const ctx = canvas.getContext('2d')

  ctx.save()
  papergen.drawLines(canvas, ctx, config)
  ctx.restore()

  ctx.save()
  papergen.drawLeftMargin(canvas, ctx, config)
  ctx.restore()

  if (!fs.existsSync(config.outputFolder)) {
    fs.mkdirSync(config.outputFolder)
  }
  const outputFile = path.join(config.outputFolder, 'out.png')
  fs.writeFileSync(outputFile, canvas.toBuffer())
}
module.exports = generatePage

if (!module.parent) {
  generatePage(defaultConfig)
}
