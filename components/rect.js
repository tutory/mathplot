const m = global.HYPER_SCRIPT
const { clozeView, group } = require('./forms')
const { min, max } = require('../utils')

function view(args, { offScaleX, offScaleY, scaleX, scaleY, showSolution }) {
  args = Object.assign(
    {
      labelX: args.x + args.width / 2,
      labelY: args.y - args.height / 2,
    },
    args
  )

  function labelView() {
    if (!args.label) return
    const x = offScaleX(args.labelX)
    const y = offScaleY(args.labelY)
    return group(
      {
        style: {
          transform: `rotate(${args.rotation}deg)`,
          transformOrigin: `${offScaleX(args.x)}px ${offScaleY(args.y)}px`,
        },
      },
      clozeView(x, y, args.label, {
        color: args.color,
        autoBackground: !args.fill,
        cloze: args.cloze,
        showSolution,
        style: {
          transform: `rotate(${-args.rotation}deg)`,
          transformOrigin: `${x}px ${y}px`,
        },
      })
    )
  }

  function rectView() {
    return m('rect', {
      x: offScaleX(args.x),
      y: offScaleY(args.y),
      width: scaleX * args.width,
      height: scaleY * args.height,
      style: {
        stroke: args.color,
        strokeWidth: args.strokeWidth,
        strokeDasharray: args.strokeDasharray,
        fill: args.fill,
        transform: `rotate(${args.rotation}deg)`,
        transformOrigin: `${offScaleX(args.x)}px ${offScaleY(args.y)}px`,
      },
    })
  }

  return [rectView(), labelView()]
}

module.exports = {
  view,
  getDimensions: ({ args }) => [
    min(args.labelX, args.x),
    max(args.labelX, args.x + args.width),
    min(args.labelY, args.y - args.height),
    max(args.labelY, args.y),
  ],
}
