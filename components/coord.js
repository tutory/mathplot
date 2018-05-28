const m = require('mithril')
const { times } = require('../utils')

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
  const lineStyle = {
    strokeWidth: '1px',
    stroke: 'black',
  }
  const lineStyleGrid = {
    strokeWidth: '1px',
    stroke: 'lightblue',
  }
  const textStyleHorizontal = {
    color: 'black',
    fontSize: `${fontSize}px`,
    textAnchor: 'end',
    alignmentBaseline: 'central',
  }
  const textStyleVertical = Object.assign({}, textStyleHorizontal, {
    textAnchor: 'middle',
    alignmentBaseline: 'before-edge',
  })
  const gapSize = 5
  const fontSize = 15
  return [
    m('line', {
      x1: scaleX * (offsetX + args.startX),
      y1: scaleY * offsetY,
      x2: scaleX * (offsetX + args.endX),
      y2: scaleY * offsetY,
      style: lineStyle,
    }),
    m('line', {
      x1: scaleX * offsetX,
      y1: scaleY * (offsetY - args.startY),
      x2: scaleX * offsetX,
      y2: scaleY * (offsetY - args.endY),
      style: lineStyle,
    }),
    // right
    times(args.endX / args.stepX - 1).map(i => [
      m('line', {
        x1: scaleX * (offsetX + (i + 1) * args.stepX),
        y1: scaleY * (offsetY + (args.grid ? args.endY : 0)),
        x2: scaleX * (offsetX + (i + 1) * args.stepX),
        y2: scaleY * (offsetY + (args.grid ? args.startY : gapSize)),
        style: args.grid ? lineStyleGrid : lineStyle,
      }),
      m(
        'text',
        {
          x: scaleX * (offsetX + (i + 1) * args.stepX),
          y: scaleY * offsetY + gapSize,
          style: textStyleVertical,
        },
        (i + 1) * args.stepX
      ),
    ]),
    // left
    times(-args.startX / args.stepX - 1).map(i => [
      m('line', {
        x1: scaleX * (offsetX - (i + 1) * args.stepX),
        y1: scaleY * (offsetY + (args.grid ? args.endX : 0)),
        x2: scaleX * (offsetX - (i + 1) * args.stepX),
        y2: scaleY * (offsetY + (args.grid ? args.startX : gapSize)),
        style: args.grid ? lineStyleGrid : lineStyle,
      }),
      m(
        'text',
        {
          x: scaleX * (offsetX - (i + 1) * args.stepX),
          y: scaleY * offsetY + gapSize,
          style: textStyleVertical,
        },
        -(i + 1) * args.stepX
      ),
    ]),
    // top
    times(args.endY / args.stepY - 1).map(i => [
      m('line', {
        x1: scaleX * (offsetX + (args.grid ? args.endX : 0)),
        y1: scaleY * (offsetY - (i + 1) * args.stepY),
        x2: scaleX * (offsetX + (args.grid ? args.startX : gapSize)),
        y2: scaleY * (offsetY - (i + 1) * args.stepY),
        style: args.grid ? lineStyleGrid : lineStyle,
      }),
      m(
        'text',
        {
          x: scaleX * offsetX - gapSize * 2,
          y: scaleY * (offsetY - (i + 1) * args.stepY),
          style: textStyleHorizontal,
        },
        (i + 1) * args.stepY
      ),
    ]),
    // down
    times(-args.startY / args.stepY - 1).map(i => [
      m('line', {
        x1: scaleX * (offsetX - (args.grid ? args.endX : 0)),
        y1: scaleY * (offsetY + (i + 1) * args.stepY),
        x2: scaleX * (offsetX - (args.grid ? args.startX : gapSize)),
        y2: scaleY * (offsetY + (i + 1) * args.stepY),
        style: args.grid ? lineStyleGrid : lineStyle,
      }),
      m(
        'text',
        {
          x: scaleX * offsetX - gapSize * 2,
          y: scaleY * (offsetY + (i + 1) * args.stepY),
          style: textStyleHorizontal,
        },
        -(i + 1) * args.stepY
      ),
    ]),
    // origin
    m(
      'text',
      {
        x: scaleX * offsetX - gapSize * 2,
        y: scaleY * offsetY + gapSize,
        style: Object.assign({}, textStyleHorizontal, {
          alignmentBaseline: 'text-before-edge',
        }),
      },
      0
    ),

    //origin
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
