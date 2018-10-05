const m = require('mithril')

const WIDTH = 10

function render(offsetX, offsetY, scaleX, scaleY, args) {
  args = Object.assign(
    {
      strokeWidth: '1px',
      color: 'blue',
      form: 'cross',
    },
    args
  )

  function crossView() {
    return [
      m('path', {
        d: `
          M ${scaleX * (offsetX + args.x) - WIDTH / 2},${scaleY *
          (offsetY - args.y) -
          WIDTH / 2}
          l ${WIDTH},${WIDTH}
        `,
        style: crossLineStyle,
      }),
      m('path', {
        d: `
          M ${scaleX * (offsetX + args.x) + WIDTH / 2},${scaleY *
          (offsetY - args.y) -
          WIDTH / 2}
          l ${-WIDTH},${WIDTH}
        `,
        style: crossLineStyle,
      }),
    ]
  }

  function circleView() {
    const isDot = args.form === 'dot'
    return m('circle', {
      cx: scaleX * (offsetX + args.x),
      cy: scaleY * (offsetY - args.y),
      r: WIDTH / (isDot ? 4 : 2),
      style: Object.assign({}, crossLineStyle, {
        fill: isDot ? args.color : 'none',
      }),
    })
  }

  function labelView() {
    if (args.label) {
      const isDot = args.form === 'dot'
      return m(
        'text',
        {
          x: scaleX * (offsetX + args.x) + WIDTH / (isDot ? 2 : 1),
          y: scaleY * (offsetY - args.y) + WIDTH / 2,
          style: {
            fill: args.color,
          },
        },
        args.label
      )
    }
  }

  const crossLineStyle = {
    strokeWidth: args.strokeWidth,
    stroke: args.color,
    fill: 'none',
  }
  return [args.form === 'cross' ? crossView() : circleView(), labelView()]
}

module.exports = {
  render,
  getMinX: ({ args }) => args.x,
  getMinY: ({ args }) => args.y,
  getMaxX: ({ args }) => args.x,
  getMaxY: ({ args }) => args.y,
}
