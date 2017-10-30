exports.drawRightGrid = (canvas, ctx, config) => {
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

exports.drawGrid = (canvas, ctx, config) => {
  ctx.lineWidth = 2
  ctx.strokeStyle = config.lineColor
  ctx.setLineDash([5, 5])

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

exports.drawCenterMargin = (canvas, ctx, config) => {
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

exports.drawLeftMargin = (canvas, ctx, config, double = true) => {
  ctx.lineWidth = 2
  ctx.strokeStyle = config.lineColor

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

exports.drawLines = (canvas, ctx, config) => {
  ctx.lineWidth = 1
  ctx.strokeStyle = config.lineColor
  ctx.setLineDash([3, 3])

  const spacing = parseFloat(config.ruling.spacing.split(' ')[0]) * config.dpiMultiplier

  ctx.beginPath()
  for (let y = 1; y <= canvas.height; y += spacing) {
    ctx.moveTo(0, y)
    ctx.lineTo(canvas.width, y)
    ctx.stroke()
  }
  ctx.closePath()
}
