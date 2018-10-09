const m = global.HYPER_SCRIPT
const { last } = require('../utils')
const lineView = require('./line').view

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

function view(args, { offScaleX, offScaleY, scaleX, scaleY }) {
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
            x: offScaleX(x),
            y: offScaleY(0) + MARGIN,
            className: isAxisLabel ? 'axisLabel' : '',
          },
          isAxisLabel ? args.labelX : args.labelXView(x)
        ),
        m('line', {
          x1: offScaleX(x),
          y1: offScaleY(0) + MARGIN,
          x2: offScaleX(x),
          y2: offScaleY(0),
          style: axisStyle,
        }),
      ]
    })
  }

  function xGridLinesView() {
    return range0(args.startX, args.endX, args.stepGridX).map(x => {
      return [
        m('line', {
          x1: offScaleX(x),
          y1: offScaleY(args.endY),
          x2: offScaleX(x),
          y2: offScaleY(args.startY),
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
            x: offScaleX(0) - 2 * MARGIN,
            y: offScaleY(y),
            className: isAxisLabel ? 'axisLabel' : '',
          },
          isAxisLabel ? args.labelY : args.labelYView(y)
        ),
        m('line', {
          x1: offScaleX(0) - MARGIN,
          y1: offScaleY(y),
          x2: offScaleX(0),
          y2: offScaleY(y),
          style: axisStyle,
        }),
      ]
    })
  }

  function yGridLinesView() {
    return range0(args.startY, args.endY, args.stepGridY).map(y => {
      return [
        m('line', {
          y1: offScaleY(y),
          x1: offScaleX(args.endX),
          y2: offScaleY(y),
          x2: offScaleX(args.startX),
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
      { offScaleX, offScaleY, scaleX, scaleY }
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
      { offScaleX, offScaleY, scaleX, scaleY }
    )
  }

  function originView() {
    return m(
      'text.horizontalRight.verticalTop',
      {
        y: offScaleY(0) + MARGIN,
        x: offScaleX(0) - MARGIN,
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
  view,
  getDimensions: ({ args }) => [args.startX, args.endX, args.startY, args.endY],
}
