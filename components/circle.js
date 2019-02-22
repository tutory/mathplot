const m = global.HYPER_SCRIPT
const { clozeView, formView } = require('./forms')
const { min, max } = require('../utils')

function view(args, { offScaleX, offScaleY, scaleX, scaleY, showSolution }) {
  let labelOffset = 0
  if (args.centerForm) {
    labelOffset += 15
  }
  if (args.cloze) {
    labelOffset += 10
  }
  args = Object.assign(
    {
      radiusX: args.radius || 1,
      radiusY: args.radius || args.radiusX || 1,
      labelX: args.x,
      labelY: args.y - labelOffset / scaleY,
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

  function centerFormView() {
    return formView(
      args.centerForm,
      offScaleX(args.x),
      offScaleY(args.y),
      args.color,
      { strokeWidth: args.strokeWidth }
    )
  }

  return [ellipseView(), labelView(), centerFormView()]
}

module.exports = {
  view,
  getDimensions: ({ args }) => [
    min(args.labelX, args.x - (args.radius || args.radiusX || 1)),
    max(args.labelX, args.x + (args.radius || args.radiusY || 1)),
    min(args.labelY, args.y - (args.radius || args.radiusX || 1)),
    max(args.labelY, args.y + (args.radius || args.radiusY || 1)),
  ],
}
