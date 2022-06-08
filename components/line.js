const m = global.HYPER_SCRIPT
const { clozeView, formView, arrowLength } = require('./forms')
const { min, max } = require('../utils')

const MARGIN = 10
const RAD_FACTOR = 180 / Math.PI
const px = x => `${x}px`

function distance(a, b) {
  return Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2))
}

function getAngleByVector(x, y) {
  if (x >= 0 && y >= 0) {
    return -Math.atan(y / x) * RAD_FACTOR
  }
  if (x < 0 && y >= 0) {
    return Math.atan(y / -x) * RAD_FACTOR - 180
  }
  if (x < 0 && y < 0) {
    return -Math.atan(y / x) * RAD_FACTOR + 180
  }
  if (x >= 0 && y < 0) {
    return Math.atan(-y / x) * RAD_FACTOR
  }
}

function view(args, { offScaleX, offScaleY, scaleX, scaleY, showSolution }) {
  args = Object.assign(
    {
      strokeWidth: 2,
      color: 'orange',
      strokeDasharray: null,
      startForm: null,
      endForm: null,
    },
    args
  )

  const angle = getAngleByVector(
    scaleX * (args.endX - args.startX),
    scaleY * (args.endY - args.startY)
  )

  function labelView() {
    if (!args.label) return
    const isHorizontalish =
      Math.abs(args.endX - args.startX) > Math.abs(args.endY - args.startY)
    const labelX =
      args.labelX == null ? (args.startX + args.endX) / 2 : args.labelX
    const labelY =
      args.labelY == null ? (args.startY + args.endY) / 2 : args.labelY

    const x = offScaleX(labelX) + (isHorizontalish ? 0 : MARGIN)
    const y = offScaleY(labelY) + (isHorizontalish ? MARGIN : 0)
    return clozeView(x, y, args.label, {
      vertical: isHorizontalish ? 'top' : 'bottom',
      horizontal: isHorizontalish ? 'right' : 'left',
      color: args.color,
      autoBackground: !args.fill,
      cloze: args.cloze,
      showSolution,
    })
  }

  function endFormView() {
    return formView(
      args.endForm,
      offScaleX(args.endX),
      offScaleY(args.endY),
      args.color,
      { angle, strokeWidth: args.strokeWidth }
    )
  }

  function startFormView() {
    return formView(
      args.startForm,
      offScaleX(args.startX),
      offScaleY(args.startY),
      args.color,
      { angle: 180 + angle, strokeWidth: args.strokeWidth }
    )
  }

  function lineView() {
    let points = [
      [args.startX, args.startY],
      [args.endX, args.endY],
    ].map(p => [offScaleX(p[0]), offScaleY(p[1])])
    const length = distance(points[0], points[1])
    if (args.startForm === 'arrow') {
      const factor = (length - arrowLength / 2) / length

      points[0] = [
        points[1][0] + (points[0][0] - points[1][0]) * factor,
        points[1][1] + (points[0][1] - points[1][1]) * factor,
      ]
    }
    if (args.endForm === 'arrow') {
      const factor = (length - arrowLength / 2) / length

      points[1] = [
        points[0][0] + (points[1][0] - points[0][0]) * factor,
        points[0][1] + (points[1][1] - points[0][1]) * factor,
      ]
    }

    return m('path', {
      d: `M ${points.map(p => p.join()).join(' ')}`,

      style: {
        strokeWidth: px(args.strokeWidth),
        stroke: args.color,
        strokeDasharray: args.strokeDasharray,
        strokeAlignment: 'center',
      },
    })
  }
  return [lineView(), startFormView(), endFormView(), labelView()]
}

module.exports = {
  view,
  getDimensions: ({ args }) => [
    min(args.labelX, args.startX, args.endX),
    max(args.labelX, args.startX, args.endX),
    min(args.labelY, args.startY, args.endY),
    max(args.labelY, args.startY, args.endY),
  ],
}
