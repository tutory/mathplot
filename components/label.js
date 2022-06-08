const m = global.HYPER_SCRIPT
const { clozeView } = require('./forms')

function view(args, { offScaleX, offScaleY, showSolution }) {
  args = Object.assign(
    {
      color: 'black',
      text: '',
      angle: 0,
      verticalAnchor: 'center',
      horizontalAnchor: 'center',
    },
    args
  )

  function labelView() {
    const x = offScaleX(args.x)
    const y = offScaleY(args.y)
    return clozeView(x, y, args.label, {
      color: args.color,
      autoBackground: !args.fill,
      cloze: args.cloze,
      showSolution,
      vertical: args.verticalAnchor,
      horizontal: args.horizontalAnchor,
      style: {
        transformOrigin: `${x}px ${y}px`,
        transform: `rotate(${args.rotation}deg)`,
      },
    })
  }

  return labelView()
}

module.exports = {
  view,
  getDimensions: ({ args }) => [args.x, args.x, args.y, args.y],
}
