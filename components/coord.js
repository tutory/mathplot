const m = require('mithril')
const { last } = require('../utils')

const AW = 10
const AH = 20
const MARGIN = 5
const FS = 15

function round(value) {
  return Math.round(value * 1000) / 1000
}

function range0(from, to, step = 1) {
  const arr = []
  for (let i = -step; i > from; i -= step) {
    arr.unshift(i)
  }
  for (let i = step; i < to; i += step) {
    arr.push(i)
  }
  return arr
}

function parse(token) {
  return {
    startX: Math.min(0, toInt(token[0])),
    startY: Math.min(0, toInt(token[1])),
    endX: Math.max(0, toInt(token[2])),
    endY: Math.max(0, toInt(token[3])),
    stepGridX: toInt(token[4]) || 1,
    stepGridY: toInt(token[5]) || 1,
    grid: true,
  }
}

function render(offsetX, offsetY, scaleX, scaleY, args) {
  args = Object.assign(
    {
      labelX: 'x',
      labelY: 'y',
      stepLabelsX: args.stepGridX || 1,
      stepLabelsY: args.stepGridY || 1,
      labelXView: x => round(x),
      labelYView: x => round(x),
    },
    args
  )

  const axisStyle = {
    strokeWidth: '1px',
    stroke: 'black',
  }

  const gridStyle = {
    strokeWidth: '1px',
    stroke: 'lightblue',
  }

  function xLabelsView() {
    const steps = range0(args.startX, args.endX, args.stepLabelsX)
    return steps.map(x => {
      const isAxisLabel = x === last(steps)
      return [
        m(
          'text',
          {
            x: scaleX * (offsetX + x),
            y: scaleY * offsetY + MARGIN,
            style: {
              textAnchor: 'middle',
              alignmentBaseline: 'hanging',
            },
            className: isAxisLabel ? 'axisLabel' : '',
          },
          isAxisLabel ? args.labelX : args.labelXView(x)
        ),
        m('line', {
          x1: scaleX * (offsetX + x),
          y1: scaleY * offsetY + MARGIN,
          x2: scaleX * (offsetX + x),
          y2: scaleY * offsetY,
          style: axisStyle,
        }),
      ]
    })
  }

  function xGridLinesView() {
    return range0(args.startX, args.endX, args.stepGridX).map(x => {
      return [
        m('line', {
          x1: scaleX * (offsetX + x),
          y1: scaleY * (offsetY - args.endY),
          x2: scaleX * (offsetX + x),
          y2: scaleY * (offsetY - args.startY),
          style: gridStyle,
        }),
      ]
    })
  }

  function yLabelsView() {
    const steps = range0(args.startY, args.endY, args.stepLabelsY)
    return steps.map(y => {
      const isAxisLabel = y === last(steps)
      return [
        m(
          'text',
          {
            y: scaleY * (offsetY - y),
            x: scaleX * offsetX - 2 * MARGIN,
            style: {
              textAnchor: 'end',
              alignmentBaseline: 'middle',
            },
            className: isAxisLabel ? 'axisLabel' : '',
          },
          isAxisLabel ? args.labelY : args.labelYView(y)
        ),
        m('line', {
          y1: scaleY * (offsetY - y),
          x1: scaleX * offsetX - MARGIN,
          y2: scaleY * (offsetY - y),
          x2: scaleX * offsetX,
          style: axisStyle,
        }),
      ]
    })
  }

  function yGridLinesView() {
    return range0(args.startY, args.endY, args.stepGridY).map(y => {
      return [
        m('line', {
          y1: scaleY * (offsetY - y),
          x1: scaleX * (offsetX + args.endX),
          y2: scaleY * (offsetY - y),
          x2: scaleX * (offsetX + args.startX),
          style: gridStyle,
        }),
      ]
    })
  }

  function xAxisView() {
    return [
      m('line', {
        x1: scaleX * (offsetX + args.startX),
        y1: scaleY * offsetY,
        x2: scaleX * (offsetX + args.endX),
        y2: scaleY * offsetY,
        style: axisStyle,
      }),
      m('path', {
        d: `M ${scaleX * (offsetX + args.endX)},${scaleY * offsetY}
        c ${-AH / 2}, ${AW / 8}, ${-AH + AW / 4}, ${AW / 4}, ${-AH},${AW / 2}
          0, 0, 0, 0, ${AW / 4}, ${-AW / 2}
          0, 0, 0, 0, ${-AW / 4}, ${-AW / 2}
          ${AW / 4}, ${AW / 4}, ${AH / 2}, ${(3 * AW) / 8}, ${AH}, ${AW / 2}
        `,
      }),
    ]
  }

  function yAxisView() {
    return [
      m('line', {
        x1: scaleX * offsetX,
        y1: scaleY * (offsetY - args.startY),
        x2: scaleX * offsetX,
        y2: scaleY * (offsetY - args.endY),
        style: axisStyle,
      }),
      m('path', {
        d: `M ${scaleX * offsetX},${scaleY * (offsetY - args.endY)}
        c ${-AW / 8}, ${AH / 2}, ${-AW / 4}, ${AH + -AW / 4}, ${-AW / 2}, ${AH}
          0, 0, 0, 0, ${AW / 2}, ${-AW / 4}
          0, 0, 0, 0, ${AW / 2}, ${AW / 4}
          ${-AW / 4}, ${-AW / 4}, ${(3 * -AW) / 8}, ${-AH / 2}, ${-AW /
          2}, ${-AH}
        `,
      }),
    ]
  }

  function originView() {
    return m(
      'text',
      {
        y: scaleY * offsetY + MARGIN,
        x: scaleX * offsetX - MARGIN,
        style: {
          textAnchor: 'end',
          alignmentBaseline: 'hanging',
        },
      },
      'O'
    )
  }

  return [
    xGridLinesView(),
    xLabelsView(),
    yGridLinesView(),
    yLabelsView(),
    xAxisView(),
    yAxisView(),
    originView(),
  ]
}

module.exports = {
  parse,
  render,
  getMinX: ({ args }) => args.startX,
  getMaxX: ({ args }) => args.endX,
  getMinY: ({ args }) => args.startY,
  getMaxY: ({ args }) => args.endY,
}
