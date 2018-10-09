const {
  formView,
  clozeView,
  crossSize,
  circleRadius,
  dotRadius,
} = require('./forms')

const MARGIN = 5

function view(args, { offScaleX, offScaleY, showSolution }) {
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
    const x = offScaleX(args.x) + gapSize
    const y = offScaleY(args.y)
    const labelX = args.labelX == null ? x : offScaleX(args.labelX)
    const labelY = args.labelY == null ? y : offScaleY(args.labelY)

    return clozeView(labelX, labelY, args.label, {
      color: args.color,
      horizontal: 'left',
      cloze: args.cloze,
      showSolution,
    })
  }

  return [
    formView(args.form, offScaleX(args.x), offScaleY(args.y), args.color),
    labelView(),
  ]
}

module.exports = {
  view,
  getDimensions: ({ args }) => [args.x, args.x, args.y, args.y],
}
