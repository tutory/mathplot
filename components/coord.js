const m = require('mithril')
const { last } = require('../utils')

const AW = 10
const AH = 20

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
    stepX: toInt(token[4]) || 1,
    stepY: toInt(token[5]) || 1,
    grid: true,
  }
}

function render(offsetX, offsetY, scaleX, scaleY, args) {
  args = Object.assign(
    {
      labelX: 'x',
      labelY: 'y',
      stepLabelsX: args.stepX || 1,
      stepLabelsY: args.stepY || 1,
      labelXView: x => x,
      labelYView: x => x,
    },
    args
  )

  function xLabelsView() {
    const steps = range0(args.startX, args.endX, args.stepLabelsX)
    return steps.map(x => {
      const isAxisLabel = x === last(steps)
      return m(
        'text',
        {
          x: scaleX * (offsetX + x),
          y: scaleY * offsetY + gapSize,
          style: textStyleX,
          className: isAxisLabel ? 'axisLabel' : '',
        },
        isAxisLabel ? args.labelX : args.labelXView(x)
      )
    })
  }

  function xGridLinesView() {
    return range0(args.startX, args.endX, args.stepX).map(x =>
      m('line', {
        x1: scaleX * (offsetX + x),
        y1: scaleY * (offsetY - (args.grid ? args.endY : 0)),
        x2: scaleX * (offsetX + x),
        y2: scaleY * (offsetY - (args.grid ? args.startY : gapSize)),
        style: args.grid ? lineStyleGrid : lineStyle,
      })
    )
  }

  function yLabelsView() {
    const steps = range0(args.startY, args.endY, args.stepLabelsY)
    return steps.map(y => {
      const isAxisLabel = y === last(steps)
      return m(
        'text',
        {
          y: scaleY * (offsetY - y),
          x: scaleX * offsetX - gapSize,
          style: textStyleY,
          className: isAxisLabel ? 'axisLabel' : '',
        },
        isAxisLabel ? args.labelY : args.labelYView(y)
      )
    })
  }

  function yGridLinesView() {
    return range0(args.startY, args.endY, args.stepY).map(y =>
      m('line', {
        y1: scaleY * (offsetY - y),
        x1: scaleX * (offsetX + (args.grid ? args.endX : 0)),
        y2: scaleY * (offsetY - y),
        x2: scaleX * (offsetX + (args.grid ? args.startX : gapSize)),
        style: args.grid ? lineStyleGrid : lineStyle,
      })
    )
  }

  function xAxisView() {
    return [
      m('line', {
        x1: scaleX * (offsetX + args.startX),
        y1: scaleY * offsetY,
        x2: scaleX * (offsetX + args.endX),
        y2: scaleY * offsetY,
        style: lineStyle,
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
        style: lineStyle,
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
  const lineStyle = {
    strokeWidth: '1px',
    stroke: 'black',
  }
  const lineStyleGrid = {
    strokeWidth: '1px',
    stroke: 'lightblue',
  }
  const textStyleY = {
    color: 'black',
    fontSize: `${fontSize}px`,
    textAnchor: 'end',
    alignmentBaseline: 'central',
  }
  const textStyleX = Object.assign({}, textStyleY, {
    textAnchor: 'middle',
    alignmentBaseline: 'before-edge',
  })
  const gapSize = 5
  const fontSize = 15
  return [
    xGridLinesView(),
    xLabelsView(),
    yGridLinesView(),
    yLabelsView(),
    xAxisView(),
    yAxisView(),
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
