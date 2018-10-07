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
  args = Object.assign(
    {
      radiusX: args.radius || 1,
      radiusY: args.radius || args.radiusX || 1,
    },
    args
  )

  function labelView() {
    if (args.label) {
      return m(
        'text.verticalCenter.horizontalCenter',
        {
          x: scaleX * (offsetX + args.centerX),
          y: scaleY * (offsetY - args.centerY),
          style: {
            fill: args.stroke,
            stroke: 'none',
          },
        },
        args.label
      )
    }
  }

  function ellipseView() {
    return m('ellipse', {
      cx: scaleX * (offsetX + args.centerX),
      cy: scaleY * (offsetY - args.centerY),
      rx: scaleX * args.radiusX,
      ry: scaleY * args.radiusY,
      style: {
        stroke: args.stroke,
        strokeWidth: args.strokeWidth,
        strokeDasharray: args.strokeDasharray,
        fill: args.fill,
      },
    })
  }

  return [ellipseView(), labelView()]
}

module.exports = {
  parse,
  render,
  getMinX: ({ args }) =>
    args.centerX - (args.radius || args.radiusX) - args.strokeWidth,
  getMaxX: ({ args }) =>
    args.centerX + (args.radius || args.radiusY) + args.strokeWidth,
  getMinY: ({ args }) =>
    args.centerY - (args.radius || args.radiusX) - args.strokeWidth,
  getMaxY: ({ args }) =>
    args.centerY + (args.radius || args.radiusY) + args.strokeWidth,
}
