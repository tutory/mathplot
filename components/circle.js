const m = require('mithril')

function parse(token) {
  return {
    centerX: toInt(token[0]),
    centerY: toInt(token[1]),
    radius: toInt(token[2]),
    stroke: token[3] || 'black',
    strokeWidth: toInt(token[4]) || 1,
    fill: token[5] || null,
  }
}

function render(offsetX, offsetY, scaleX, scaleY, args) {
  return m('ellipse', {
    cx: scaleX * (offsetX + args.centerX),
    cy: scaleY * (offsetY - args.centerY),
    rx: scaleX * args.radius,
    ry: scaleY * args.radius,
    stroke: args.stroke,
    'stroke-width': args.strokeWidth,
    fill: args.fill,
  })
}

module.exports = {
  parse,
  render,
  getMinX: ({ args }) => args.centerX - args.radius - args.strokeWidth,
  getMaxX: ({ args }) => args.centerX + args.radius + args.strokeWidth,
  getMinY: ({ args }) => args.centerY - args.radius - args.strokeWidth,
  getMaxY: ({ args }) => args.centerY + args.radius + args.strokeWidth,
}
