const m = require('mithril')
const {
  crossView,
  crossSize,
  circleView,
  circleRadius,
  dotView,
  dotRadius,
} = require('./forms')

const MARGIN = 5

function render(offsetX, offsetY, scaleX, scaleY, args) {
  args = Object.assign(
    {
      strokeWidth: '1px',
      color: 'blue',
      form: 'cross',
    },
    args
  )

  function labelView() {
    if (args.label) {
      const gapSize =
        {
          dot: dotRadius,
          circle: circleRadius,
          cross: crossSize / 2,
        }[args.form] + MARGIN
      return m(
        'text.verticalCenter',
        {
          x: scaleX * (offsetX + args.x) + gapSize,
          y: scaleY * (offsetY - args.y),
          style: {
            fill: args.color,
          },
        },
        args.label
      )
    }
  }

  const formView = {
    cross: crossView,
    circle: circleView,
    dot: dotView,
  }[args.form]

  return [
    formView(
      scaleX * (offsetX + args.x),
      scaleY * (offsetY - args.y),
      args.color
    ),
    labelView(),
  ]
}

module.exports = {
  render,
  getMinX: ({ args }) => args.x,
  getMinY: ({ args }) => args.y,
  getMaxX: ({ args }) => args.x,
  getMaxY: ({ args }) => args.y,
}
