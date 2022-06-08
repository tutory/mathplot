const {
  formView,
  clozeView,
  crossSize,
  circleRadius,
  dotRadius,
} = require('./forms')
const { min, max } = require('../utils')

const MARGIN = 5

function view(args, { offScaleX, offScaleY, showSolution }) {
  args = Object.assign(
    {
      strokeWidth: 2,
      color: 'blue',
      form: 'cross',
    },
    args
  )
  const halfStrokeWidth = args.strokeWidth / 2

  function labelView() {
    if (!args.label) return
    const gapSize =
      ({
        dot: dotRadius,
        circle: circleRadius,
        cross: crossSize / 2,
      }[args.form] || 0) *
        halfStrokeWidth +
      MARGIN
    const x = offScaleX(args.x) + gapSize
    const y = offScaleY(args.y)
    const labelX = args.labelX == null ? x : offScaleX(args.labelX)
    const labelY = args.labelY == null ? y : offScaleY(args.labelY)

    return clozeView(labelX, labelY, args.label, {
      color: args.color,
      horizontal: args.labelHorizontalAlign || 'left',
      cloze: args.cloze,
      showSolution,
    })
  }

  return [
    formView(args.form, offScaleX(args.x), offScaleY(args.y), args.color, {
      strokeWidth: args.strokeWidth,
    }),
    labelView(),
  ]
}

module.exports = {
  view,
  getDimensions: ({ args }) => [
    min(args.labelX, args.x),
    max(args.labelX, args.x),
    min(args.labelY, args.y),
    max(args.labelY, args.y),
  ],
}
