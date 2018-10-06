const m = require('mithril')
const { arrowView } = require('./forms')

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

function cos(angle) {
  return Math.cos(angle * (Math.PI / 180))
}
function sin(angle) {
  return Math.sin(angle * (Math.PI / 180))
}

function render(offsetX, offsetY, scaleX, scaleY, args) {
  const offsetAngle = 90

  function fillView() {
    if (!args.fill) {
      return
    }
    return m('path', {
      d: `
        M
        ${scaleX * (offsetX + args.centerX)}
        ${scaleY * (offsetY - args.centerY)}
        l
        ${scaleX * (sin(offsetAngle + args.startAngle) * args.radius)}
        ${scaleY * (cos(offsetAngle + args.startAngle) * args.radius)}
        A
        ${scaleX * args.radius}
        ${scaleY * args.radius}
        0
        0
        0
        ${scaleX *
          (offsetX +
            args.centerX +
            sin(offsetAngle + args.endAngle) * args.radius)}
        ${scaleY *
          (offsetY -
            args.centerY +
            cos(offsetAngle + args.endAngle) * args.radius)}
        Z
      `,
      style: {
        stroke: 'none',
        fill: args.fill,
      },
    })
  }

  function strokeView() {
    return m('path', {
      d: `
        M
        ${scaleX * (offsetX + args.centerX)}
        ${scaleY * (offsetY - args.centerY)}
        m
        ${scaleX * (sin(offsetAngle + args.startAngle) * args.radius)}
        ${scaleY * (cos(offsetAngle + args.startAngle) * args.radius)}
        A
        ${scaleX * args.radius}
        ${scaleY * args.radius}
        0
        0
        0
        ${scaleX *
          (offsetX +
            args.centerX +
            sin(offsetAngle + args.endAngle) * args.radius)}
        ${scaleY *
          (offsetY -
            args.centerY +
            cos(offsetAngle + args.endAngle) * args.radius)}

      `,
      style: {
        stroke: args.color,
        strokeWidth: args.strokeWidth,
        strokeDasharray: args.strokeDasharray,
        fill: 'none',
      },
    })
  }

  function labelView() {
    if (!args.label) {
      return
    }
    const centerAngle = offsetAngle + (args.startAngle + args.endAngle) / 2
    const middleRadius = args.radius / 2
    return m(
      'text',
      {
        x: scaleX * (offsetX + args.centerX + sin(centerAngle) * middleRadius),
        y: scaleY * (offsetY - args.centerY + cos(centerAngle) * middleRadius),
        style: {
          fill: args.color,
          stroke: 'none',
          textAnchor: 'middle',
          alignmentBaseline: 'middle',
        },
      },
      args.label
    )
  }

  function endFormView() {
    if (args.endForm === 'arrow') {
      const x =
        scaleY *
        (offsetX +
          args.centerX +
          sin(offsetAngle + args.endAngle) * args.radius)
      const y =
        scaleY *
        (offsetY -
          args.centerY +
          cos(offsetAngle + args.endAngle) * args.radius)
      return arrowView(
        x,
        y,
        (2 * offsetAngle + 10 / args.radius + args.endAngle) * (Math.PI / 180),
        args.color
      )
    }
  }

  return [fillView(), strokeView(), endFormView(), labelView()]
}

module.exports = {
  parse,
  render,
  getMinX: ({ args }) => args.centerX - args.radius - args.strokeWidth,
  getMaxX: ({ args }) => args.centerX + args.radius + args.strokeWidth,
  getMinY: ({ args }) => args.centerY - args.radius - args.strokeWidth,
  getMaxY: ({ args }) => args.centerY + args.radius + args.strokeWidth,
}
