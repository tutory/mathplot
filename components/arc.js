const m = global.HYPER_SCRIPT
const { clozeView, formView, arrowLength } = require('./forms')
const { clamp, min, max } = require('../utils')

function cos(angle) {
  return Math.cos(angle * (Math.PI / 180))
}
function sin(angle) {
  return Math.sin(angle * (Math.PI / 180))
}

function view(args, { offScaleX, offScaleY, scaleX, scaleY, showSolution }) {
  const offsetAngle = 90
  const arcScaleY = args.keepAspect ? scaleX : scaleY
  const [startArcX, startArcY] = getPointByAngle(args.startAngle)
  const [endArcX, endArcY] = getPointByAngle(args.endAngle)

  args = Object.assign({}, args)

  function getLabelPos() {
    if (args.labelX != null && args.labelY != null) {
      return [args.labelX, args.labelY]
    }
    const centerAngle =
      (args.startAngle + args.endAngle) / 2 +
      (args.startAngle > args.endAngle ? 180 : 0)
    const distance = clamp(
      args.radius * 0.5,
      args.radius * 0.8,
      args.radius * (30 / (args.endAngle - args.startAngle))
    )
    const pos = getPointByAngle(centerAngle, distance)
    return [
      args.labelX == null ? pos[0] : args.labelX,
      args.labelY == null ? pos[1] : args.labelY,
    ]
  }

  function getPointByAngle(angle, radius = args.radius) {
    return [
      offScaleX(args.x) + scaleX * sin(offsetAngle + angle) * radius,
      offScaleY(args.y) + arcScaleY * cos(offsetAngle + angle) * radius,
    ]
  }

  function fillView() {
    if (!args.fill) {
      return
    }
    return m('path', {
      d: `
        M
        ${offScaleX(args.x)}
        ${offScaleY(args.y)}
        L
        ${startArcX}
        ${startArcY}
        A
        ${scaleX * args.radius}
        ${arcScaleY * args.radius}
        0
        ${args.startAngle > args.endAngle ? 1 : 0}
        0
        ${endArcX}
        ${endArcY}
        Z
      `,
      style: {
        stroke: 'none',
        fill: args.fill,
      },
    })
  }

  function strokeView() {
    const startAngle =
      args.startForm === 'arrow'
        ? args.startAngle +
          (arrowLength * (0.5 + args.strokeWidth * 0.5)) / args.radius
        : args.startAngle
    const endAngle =
      args.endForm === 'arrow'
        ? args.endAngle -
          (arrowLength * (0.5 + args.strokeWidth * 0.5)) / args.radius
        : args.endAngle
    const [startArcX, startArcY] = getPointByAngle(startAngle)
    const [endArcX, endArcY] = getPointByAngle(endAngle)

    return m('path', {
      d: `
        M
        ${startArcX}
        ${startArcY}
        A
        ${scaleX * args.radius}
        ${arcScaleY * args.radius}
        0
        ${args.startAngle > args.endAngle ? 1 : 0}
        0
        ${endArcX}
        ${endArcY}
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
    return clozeView(...getLabelPos(), args.label, {
      color: args.color,
      autoBackground: !args.fill,
      cloze: args.cloze,
      showSolution,
    })
  }

  function endFormView() {
    if (!args.endForm) return
    const [x, y] = getPointByAngle(args.endAngle)
    return formView(args.endForm, x, y, args.color, {
      angle: -90 - args.endAngle,
      radius: args.radius,
      scale: args.strokeWidth,
      end: true,
    })
  }

  function startFormView() {
    if (!args.startForm) return
    const [x, y] = getPointByAngle(args.startAngle)
    return formView(args.startForm, x, y, args.color, {
      angle: 90 - args.startAngle,
      radius: args.radius,
      scale: args.strokeWidth,
    })
  }

  return [fillView(), strokeView(), startFormView(), endFormView(), labelView()]
}

module.exports = {
  view,
  getDimensions: ({ args }) => [
    min(args.labelX, args.x - args.radius),
    max(args.labelX, args.x + args.radius),
    min(args.labelY, args.y - args.radius),
    max(args.labelY, args.y + args.radius),
  ],
}
