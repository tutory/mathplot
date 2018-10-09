const m = require('mithril')
const { clozeView } = require('./forms')

function render(args, { offScaleX, offScaleY, showSolution }) {
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
        transform: `rotate(${args.rotate}deg)`,
      },
    })
  }

  return [labelView()]
}

module.exports = {
  render,
  getMinX: ({ args }) => args.x,
  getMinY: ({ args }) => args.y,
  getMaxX: ({ args }) => args.x,
  getMaxY: ({ args }) => args.y,
}
