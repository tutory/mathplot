const m = require('mithril')

const alignmentMap = {
  top: 'hanging',
  middle: 'middle',
  bottom: 'baseline',
}

function render(offsetX, offsetY, scaleX, scaleY, args) {
  args = Object.assign(
    {
      color: 'black',
      text: '',
      angle: 0,
      verticalAnchor: 'middle',
      horizontalAnchor: 'middle',
    },
    args
  )

  function labelView() {
    const x = scaleX * (offsetX + args.x)
    const y = scaleY * (offsetY - args.y)
    return m(
      'text',
      {
        x,
        y,
        style: {
          fill: args.color,
          textAnchor: args.horizontalAnchor,
          alignmentBaseline: alignmentMap[args.verticalAnchor],
          transformOrigin: `${x}px ${y}px`,
          transform: `rotate(${args.rotate}deg)`,
        },
      },
      args.label
    )
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
