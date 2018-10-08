const m = require('mithril')
const { last } = require('../utils')
const lineView = require('./line').render

const MARGIN = 5

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

function render(args, { offsetX, offsetY, scaleX, scaleY }) {
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
          'text.horizontalCenter.verticalTop',
          {
            x: scaleX * (offsetX + x),
            y: scaleY * offsetY + MARGIN,
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
          'text.verticalCenter.horizontalRight',
          {
            y: scaleY * (offsetY - y),
            x: scaleX * offsetX - 2 * MARGIN,
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
    return lineView(
      {
        startX: args.startX,
        startY: 0,
        endX: args.endX,
        endY: 0,
        endForm: 'arrow',
        color: 'black',
        strokeWidth: 1,
      },
      { offsetX, offsetY, scaleX, scaleY }
    )
  }

  function yAxisView() {
    return lineView(
      {
        startX: 0,
        startY: args.startY,
        endX: 0,
        endY: args.endY,
        endForm: 'arrow',
        color: 'black',
        strokeWidth: 1,
      },
      { offsetX, offsetY, scaleX, scaleY }
    )
  }

  function originView() {
    return m(
      'text.horizontalRight.verticalTop',
      {
        y: scaleY * offsetY + MARGIN,
        x: scaleX * offsetX - MARGIN,
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
