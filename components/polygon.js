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
    d: `M ${args.points
      .concat([args.points[0]])
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
  getMinX: ({ args }) => Math.min(...args.points.map(p => p[0])),
  getMinY: ({ args }) => Math.min(...args.points.map(p => p[1])),
  getMaxX: ({ args }) => Math.max(...args.points.map(p => p[0])),
  getMaxY: ({ args }) => Math.max(...args.points.map(p => p[1])),
}
