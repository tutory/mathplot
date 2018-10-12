const m = global.HYPER_SCRIPT
const { clozeView } = require('./forms')
const { min, max } = require('../utils')

function sum(arr) {
  return arr.reduce((sum, v) => sum + v, 0)
}

function view(args, { offScaleX, offScaleY, showSolution }) {
  args = Object.assign(
    {
      strokeWidth: '2px',
      color: 'orange',
      fill: 'none',
    },
    args
  )

  function pathView() {
    return m('path', {
      d: `M ${args.points
        .map(p => [offScaleX(p[0]), offScaleY(p[1])].join())
        .join(' ')} Z`,
      style: {
        strokeWidth: args.strokeWidth,
        stroke: args.color,
        fill: args.fill,
      },
    })
  }

  function labelView() {
    if (!args.label) return
    const labelX =
      args.labelX || sum(args.points.map(p => p[0])) / args.points.length
    const x = offScaleX(labelX)
    const labelY =
      args.labelY || sum(args.points.map(p => p[1])) / args.points.length
    const y = offScaleY(labelY)

    return clozeView(x, y, args.label, {
      color: args.color,
      autoBackground: !args.fill,
      cloze: args.cloze,
      showSolution,
    })
  }

  return [pathView(), labelView()]
}

module.exports = {
  view,
  getDimensions: ({ args }) => [
    min(args.labelX, ...args.points.map(p => p[0])),
    max(args.labelX, ...args.points.map(p => p[0])),
    min(args.labelY, ...args.points.map(p => p[1])),
    max(args.labelY, ...args.points.map(p => p[1])),
  ],
}
