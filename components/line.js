const m = require('mithril')
const { clozeView, formView, arrowLength } = require('./forms')

const MARGIN = 10
const RAD_FACTOR = 180 / Math.PI
const px = x => `${x}px`

function distance(a, b) {
  return Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2))
}

function render(args, { offsetX, offsetY, scaleX, scaleY, showSolution }) {
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

  const angle =
    Math.atan(
      (scaleX * (args.endX - args.startX)) /
        (scaleY * (args.endY - args.startY))
    ) * RAD_FACTOR

  function labelView() {
    if (!args.label) return
    isHorizontalish =
      Math.abs(args.endX - args.startX) > Math.abs(args.endY - args.startY)
    const x =
      scaleX * (offsetX + (args.startX + args.endX) / 2) +
      (isHorizontalish ? 0 : MARGIN)
    const y =
      scaleY * (offsetY - (args.startY + args.endY) / 2) +
      (isHorizontalish ? MARGIN : 0)
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
      scaleX * (offsetX + args.endX),
      scaleY * (offsetY - args.endY),
      args.color,
      { angle }
    )
  }

  function startFormView() {
    return formView(
      args.startForm,
      scaleX * (offsetX + args.startX),
      scaleY * (offsetY - args.startY),
      args.color,
      { angle: 180 + angle }
    )
  }

  function lineView() {
    let points = [[args.startX, args.startY], [args.endX, args.endY]].map(p => [
      scaleX * (offsetX + p[0]),
      scaleY * (offsetY - p[1]),
    ])
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
  render,
  getMinX: ({ args }) => Math.min(args.startX, args.endX),
  getMinY: ({ args }) => Math.min(args.startY, args.endY),
  getMaxX: ({ args }) => Math.max(args.startX, args.endX),
  getMaxY: ({ args }) => Math.max(args.startY, args.endY),
}
