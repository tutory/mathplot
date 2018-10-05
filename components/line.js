const m = require('mithril')

function render(offsetX, offsetY, scaleX, scaleY, args) {
  args = Object.assign(
    {
      strokeWidth: '2px',
      stroke: 'orange',
      fill: 'none',
    },
    args
  )
  return m('path', {
    d: `M ${[[args.startX, args.startY], [args.endX, args.endY]]
      .map(p => [scaleX * (offsetX + p[0]), scaleY * (offsetY - p[1])].join())
      .join(' ')}`,

    style: {
      strokeWidth: args.strokeWidth,
      stroke: args.stroke,
      fill: args.fill,
    },
  })
}

module.exports = {
  render,
  getMinX: ({ args }) => Math.min(args.startX, args.endX),
  getMinY: ({ args }) => Math.min(args.startY, args.endY),
  getMaxX: ({ args }) => Math.max(args.startX, args.endX),
  getMaxY: ({ args }) => Math.max(args.startY, args.endY),
}
