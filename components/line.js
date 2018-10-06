const m = require('mithril')
const { arrowView, arrowLength } = require('./forms')

const MARGIN = 10

const px = x => `${x}px`

function distance(a, b) {
  return Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2))
}

function render(offsetX, offsetY, scaleX, scaleY, args) {
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

  function labelView() {
    if (args.label) {
      isHorizontalish =
        Math.abs(args.endX - args.startX) > Math.abs(args.endY - args.startY)
      return m(
        'text',
        {
          x:
            scaleX * (offsetX + (args.startX + args.endX) / 2) +
            (isHorizontalish ? 0 : MARGIN),
          y:
            scaleY * (offsetY - (args.startY + args.endY) / 2) +
            (isHorizontalish ? MARGIN : 0),
          style: {
            fill: args.color,
            textAnchor: isHorizontalish ? 'end' : 'start',
            alignmentBaseline: isHorizontalish ? 'hanging' : 'baseline',
          },
        },
        args.label
      )
    }
  }

  function endFormView() {
    if (args.endForm === 'arrow') {
      return arrowView(
        scaleX * (offsetX + args.endX),
        scaleY * (offsetY - args.endY),
        Math.atan((args.endX - args.startX) / (args.endY - args.startY)),
        args.color
      )
    }
  }

  function startFormView() {
    if (args.startForm === 'arrow') {
      return arrowView(
        scaleX * (offsetX + args.startX),
        scaleY * (offsetY - args.startY),
        Math.PI +
          Math.atan((args.endX - args.startX) / (args.endY - args.startY)),
        args.color
      )
    }
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
