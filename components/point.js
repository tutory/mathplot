const m = require('mithril')

const CROSS_WIDTH = 10

function render(offsetX, offsetY, scaleX, scaleY, args) {
  args = Object.assign(
    {
      strokeWidth: '1px',
      stroke: 'blue',
    },
    args
  )
  const crossLineStyle = {
    strokeWidth: args.strokeWidth,
    stroke: args.stroke,
    fill: 'none',
  }
  return [
    m('path', {
      d: `
        M ${scaleX * (offsetX + args.x) - CROSS_WIDTH / 2},${scaleY *
        (offsetY + args.y) -
        CROSS_WIDTH / 2}
        l ${CROSS_WIDTH},${CROSS_WIDTH}
      `,
      style: crossLineStyle,
    }),
    m('path', {
      d: `
        M ${scaleX * (offsetX + args.x) + CROSS_WIDTH / 2},${scaleY *
        (offsetY + args.y) -
        CROSS_WIDTH / 2}
        l ${-CROSS_WIDTH},${CROSS_WIDTH}
      `,
      style: crossLineStyle,
    }),
  ]
}

module.exports = {
  render,
  getMinX: ({ args }) => args.x,
  getMinY: ({ args }) => args.y,
  getMaxX: ({ args }) => args.x,
  getMaxY: ({ args }) => args.y,
}
