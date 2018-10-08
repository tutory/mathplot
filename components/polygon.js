const m = require('mithril')
const { clozeView } = require('./forms')

function sum(arr) {
  return arr.reduce((sum, v) => sum + v, 0)
}

function render(args, { offsetX, offsetY, scaleX, scaleY, showSolution }) {
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
        .map(p => [scaleX * (offsetX + p[0]), scaleY * (offsetY - p[1])].join())
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
    const x = scaleX * (offsetX + labelX)
    const labelY =
      args.labelY || sum(args.points.map(p => p[1])) / args.points.length
    const y = scaleY * (offsetY - labelY)

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
  render,
  getMinX: ({ args }) => Math.min(...args.points.map(p => p[0])),
  getMinY: ({ args }) => Math.min(...args.points.map(p => p[1])),
  getMaxX: ({ args }) => Math.max(...args.points.map(p => p[0])),
  getMaxY: ({ args }) => Math.max(...args.points.map(p => p[1])),
}
