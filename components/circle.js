const m = require('mithril')
const { clozeView } = require('./forms')

function parse(token) {
  return {
    centerX: toInt(token[0]),
    centerY: toInt(token[1]),
    radius: toInt(token[2]),
    stroke: token[3] || 'black',
    strokeWidth: toInt(token[4]) || 1,
    fill: token[5] || null,
  }
}

function render(args, { offsetX, offsetY, scaleX, scaleY, showSolution }) {
  args = Object.assign(
    {
      radiusX: args.radius || 1,
      radiusY: args.radius || args.radiusX || 1,
    },
    args
  )

  function labelView() {
    if (!args.label) return
    const labelX = args.labelX == null ? args.centerX : args.labelX
    const labelY = args.labelY == null ? args.centerY : args.labelY
    const x = scaleX * (offsetX + labelX)
    const y = scaleY * (offsetY - labelY)
    return clozeView(x, y, args.label, {
      color: args.color,
      autoBackground: !args.fill,
      cloze: args.cloze,
      showSolution,
    })
  }

  function ellipseView() {
    return m('ellipse', {
      cx: scaleX * (offsetX + args.centerX),
      cy: scaleY * (offsetY - args.centerY),
      rx: scaleX * args.radiusX,
      ry: scaleY * args.radiusY,
      style: {
        stroke: args.color,
        strokeWidth: args.strokeWidth,
        strokeDasharray: args.strokeDasharray,
        fill: args.fill,
      },
    })
  }

  return [ellipseView(), labelView()]
}

module.exports = {
  parse,
  render,
  getMinX: ({ args }) =>
    args.centerX - (args.radius || args.radiusX) - args.strokeWidth,
  getMaxX: ({ args }) =>
    args.centerX + (args.radius || args.radiusY) + args.strokeWidth,
  getMinY: ({ args }) =>
    args.centerY - (args.radius || args.radiusX) - args.strokeWidth,
  getMaxY: ({ args }) =>
    args.centerY + (args.radius || args.radiusY) + args.strokeWidth,
}
