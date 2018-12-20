const m = global.HYPER_SCRIPT
const { clozeView } = require('./forms')
const pointView = require('./point').view
const { min, max } = require('../utils')

const LABEL_DISTANCE = 0.2
const CLOZE_LABEL_DISTANCE = 0.4

function coalesce(...args) {
  for (let arg of args) {
    if (arg != null) return arg
  }
}

function sum(arr) {
  return arr.reduce((sum, v) => sum + v, 0)
}

function view(args, { offScaleX, offScaleY, showSolution }) {
  const centerX = sum(args.points.map(p => p.x)) / args.points.length
  const centerY = sum(args.points.map(p => p.y)) / args.points.length
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
        .map(p => [offScaleX(p.x), offScaleY(p.y)].join())
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
    const labelX = args.labelX || centerX
    const x = offScaleX(labelX)
    const labelY = args.labelY || centerY
    const y = offScaleY(labelY)

    return clozeView(x, y, args.label, {
      color: args.color,
      autoBackground: !args.fill,
      cloze: args.cloze,
      showSolution,
    })
  }

  function pointsView() {
    return args.points.map(p => {
      const cloze = coalesce(p.cloze, args.cloze)
      const labelDistance = cloze ? CLOZE_LABEL_DISTANCE : LABEL_DISTANCE
      const a = (p.y - centerY) / (p.x - centerX)
      const labelX2 = labelDistance / (1 + a * a)
      const dirX = p.x < centerX ? -1 : 1
      const dirY = p.y < centerY ? -1 : 1
      const labelX = coalesce(p.labelX, p.x + Math.sqrt(labelX2) * dirX)
      const labelY = coalesce(
        p.labelY,
        p.y + Math.sqrt(labelDistance - labelX2) * dirY
      )
      return pointView(
        {
          x: p.x,
          y: p.y,
          label: p.label,
          color: coalesce(p.color, args.color),
          form: p.form,
          labelX,
          labelY,
          labelHorizontalAlign: 'center',
          cloze,
        },
        { offScaleX, offScaleY, showSolution }
      )
    })
  }

  return [pathView(), pointsView(), labelView()]
}

module.exports = {
  view,
  getDimensions: ({ args }) => [
    min(args.labelX, ...args.points.map(p => p.x)),
    max(args.labelX, ...args.points.map(p => p.x)),
    min(args.labelY, ...args.points.map(p => p.y)),
    max(args.labelY, ...args.points.map(p => p.y)),
  ],
}
