const m = require('mithril')

const MARGIN = 10
const AW = 10
const AH = 20

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
      return m('path', {
        d: `M ${scaleX * (offsetX + args.endX)},${scaleY *
          (offsetY - args.endY)}
        c ${-AW / 8}, ${AH / 2}, ${-AW / 4}, ${AH + -AW / 4}, ${-AW / 2}, ${AH}
          0, 0, 0, 0, ${AW / 2}, ${-AW / 4}
          0, 0, 0, 0, ${AW / 2}, ${AW / 4}
          ${-AW / 4}, ${-AW / 4}, ${(3 * -AW) / 8}, ${-AH / 2}, ${-AW /
          2}, ${-AH}
        `,
        style: {
          fill: args.color,
          transformOrigin: `${scaleX * (offsetX + args.endX)}px ${scaleY *
            (offsetY - args.endY)}px`,
          transform: `rotate(${Math.atan(
            (args.endX - args.startX) / (args.endY - args.startY)
          )}rad)`,
        },
      })
    }
  }

  function lineView() {
    let points = [[args.startX, args.startY], [args.endX, args.endY]].map(p => [
      scaleX * (offsetX + p[0]),
      scaleY * (offsetY - p[1]),
    ])
    if (args.endForm === 'arrow') {
      const length = distance(points[0], points[1])
      const factor = (length - AH / 2) / length

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
  return [lineView(), endFormView(), labelView()]
}

module.exports = {
  render,
  getMinX: ({ args }) => Math.min(args.startX, args.endX),
  getMinY: ({ args }) => Math.min(args.startY, args.endY),
  getMaxX: ({ args }) => Math.max(args.startX, args.endX),
  getMaxY: ({ args }) => Math.max(args.startY, args.endY),
}
