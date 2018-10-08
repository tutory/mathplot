const m = require('mithril')
const {
  formView,
  clozeView,
  crossSize,
  circleRadius,
  dotRadius,
} = require('./forms')

const MARGIN = 5

function render(args, { offsetX, offsetY, scaleX, scaleY, showSolution }) {
  args = Object.assign(
    {
      strokeWidth: '1px',
      color: 'blue',
      form: 'cross',
    },
    args
  )

  function labelView() {
    if (!args.label) return
    const gapSize =
      {
        dot: dotRadius,
        circle: circleRadius,
        cross: crossSize / 2,
      }[args.form] + MARGIN
    const x = scaleX * (offsetX + args.x) + gapSize
    const y = scaleY * (offsetY - args.y)

    return clozeView(x, y, args.label, {
      color: args.color,
      horizontal: 'left',
      cloze: args.cloze,
      showSolution,
    })
  }

  return [
    formView(
      args.form,
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
