const m = require('mithril')
const { arrowView, arrowLength } = require('./forms')

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

function clamp(min, max, x) {
  if (x < min) return min
  if (x > max) return max
  return x
}

function cos(angle) {
  return Math.cos(angle * (Math.PI / 180))
}
function sin(angle) {
  return Math.sin(angle * (Math.PI / 180))
}

function render(offsetX, offsetY, scaleX, scaleY, args) {
  const offsetAngle = 90
  const arcScaleY = args.keepAspect ? scaleX : scaleY

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
        ${arcScaleY * (cos(offsetAngle + args.startAngle) * args.radius)}
        A
        ${scaleX * args.radius}
        ${arcScaleY * args.radius}
        0
        ${args.startAngle > args.endAngle ? 1 : 0}
        0
        ${scaleX *
          (offsetX +
            args.centerX +
            sin(offsetAngle + args.endAngle) * args.radius)}
        ${scaleY * (offsetY - args.centerY) +
          arcScaleY * cos(offsetAngle + args.endAngle) * args.radius}
        Z
      `,
      style: {
        stroke: 'none',
        fill: args.fill,
      },
    })
  }

  function strokeView() {
    const endAngle =
      args.endForm === 'arrow'
        ? args.endAngle - arrowLength / args.radius
        : args.endAngle

    return m('path', {
      d: `
        M
        ${scaleX * (offsetX + args.centerX)}
        ${scaleY * (offsetY - args.centerY)}
        m
        ${scaleX * (sin(offsetAngle + args.startAngle) * args.radius)}
        ${arcScaleY * (cos(offsetAngle + args.startAngle) * args.radius)}
        A
        ${scaleX * args.radius}
        ${arcScaleY * args.radius}
        0
        ${args.startAngle > args.endAngle ? 1 : 0}
        0
        ${scaleX *
          (offsetX + args.centerX + sin(offsetAngle + endAngle) * args.radius)}
        ${scaleY * (offsetY - args.centerY) +
          arcScaleY * cos(offsetAngle + endAngle) * args.radius}

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
    const centerAngle =
      offsetAngle +
      (args.startAngle + args.endAngle) / 2 +
      (args.startAngle > args.endAngle ? 180 : 0)
    const distance = clamp(
      args.radius * 0.5,
      args.radius * 0.8,
      args.radius * (30 / (args.endAngle - args.startAngle))
    )
    return m(
      'text',
      {
        x: scaleX * (offsetX + args.centerX + sin(centerAngle) * distance),
        y:
          scaleY * (offsetY - args.centerY) +
          arcScaleY * cos(centerAngle) * distance,
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
        scaleX *
        (offsetX +
          args.centerX +
          sin(offsetAngle + args.endAngle) * args.radius)
      const y =
        scaleY * (offsetY - args.centerY) +
        arcScaleY * cos(offsetAngle + args.endAngle) * args.radius
      return arrowView(
        x,
        y,
        (10 / args.radius) * (scaleY / scaleX) - args.endAngle,
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
