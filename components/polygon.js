const m = require('mithril')

function sum(arr) {
  return arr.reduce((sum, v) => sum + v, 0)
}

function render(offsetX, offsetY, scaleX, scaleY, args) {
  args = Object.assign(
    {
      strokeWidth: '2px',
      stroke: 'orange',
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
        stroke: args.stroke,
        fill: args.fill,
      },
    })
  }

  function labelView() {
    if (args.label) {
      const centerX = sum(args.points.map(p => p[0])) / args.points.length
      const centerY = sum(args.points.map(p => p[1])) / args.points.length
      return m(
        'text',
        {
          x: scaleX * (offsetX + centerX),
          y: scaleY * (offsetY - centerY),
          style: {
            fill: args.stroke,
            textAnchor: 'middle',
            alignmentBaseline: 'middle',
            stroke: 'none',
          },
        },
        args.label
      )
    }
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
