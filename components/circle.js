const m = global.HYPER_SCRIPT
const { clozeView } = require('./forms')

function parse(token) {
  return {
    x: toInt(token[0]),
    y: toInt(token[1]),
    radius: toInt(token[2]),
    stroke: token[3] || 'black',
    strokeWidth: toInt(token[4]) || 1,
    fill: token[5] || null,
  }
}

function render(args, { offScaleX, offScaleY, scaleX, scaleY, showSolution }) {
  args = Object.assign(
    {
      radiusX: args.radius || 1,
      radiusY: args.radius || args.radiusX || 1,
      labelX: args.x,
      labelY: args.y,
    },
    args
  )

  function labelView() {
    if (!args.label) return
    const x = offScaleX(args.labelX)
    const y = offScaleY(args.labelY)
    return clozeView(x, y, args.label, {
      color: args.color,
      autoBackground: !args.fill,
      cloze: args.cloze,
      showSolution,
    })
  }

  function ellipseView() {
    return m('ellipse', {
      cx: offScaleX(args.x),
      cy: offScaleY(args.y),
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
    args.x - (args.radius || args.radiusX) - args.strokeWidth,
  getMaxX: ({ args }) =>
    args.x + (args.radius || args.radiusY) + args.strokeWidth,
  getMinY: ({ args }) =>
    args.y - (args.radius || args.radiusX) - args.strokeWidth,
  getMaxY: ({ args }) =>
    args.y + (args.radius || args.radiusY) + args.strokeWidth,
}
