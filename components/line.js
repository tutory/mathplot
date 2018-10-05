const m = require('mithril')

const MARGIN = 10

function render(offsetX, offsetY, scaleX, scaleY, args) {
  args = Object.assign(
    {
      strokeWidth: '2px',
      color: 'orange',
    },
    args
  )

  function labelView() {
    if (args.label) {
      isHorizontalish =
        Math.abs(args.endX - args.startX) > Math.abs(args.endY - args.startY)
      return m(
        'text',
        {
          x:
            scaleX * (offsetX + (args.startX + args.endX) / 2) +
            (isHorizontalish ? 0 : MARGIN),
          y:
            scaleY * (offsetY - (args.startY + args.endY) / 2) +
            (isHorizontalish ? MARGIN : 0),
          style: {
            fill: args.color,
            textAnchor: isHorizontalish ? 'end' : 'start',
            alignmentBaseline: isHorizontalish ? 'hanging' : 'baseline',
          },
        },
        args.label
      )
    }
  }

  return [
    m('path', {
      d: `M ${[[args.startX, args.startY], [args.endX, args.endY]]
        .map(p => [scaleX * (offsetX + p[0]), scaleY * (offsetY - p[1])].join())
        .join(' ')}`,

      style: {
        strokeWidth: args.strokeWidth,
        stroke: args.color,
        fill: 'none',
      },
    }),
    labelView(),
  ]
}

module.exports = {
  render,
  getMinX: ({ args }) => Math.min(args.startX, args.endX),
  getMinY: ({ args }) => Math.min(args.startY, args.endY),
  getMaxX: ({ args }) => Math.max(args.startX, args.endX),
  getMaxY: ({ args }) => Math.max(args.startY, args.endY),
}
