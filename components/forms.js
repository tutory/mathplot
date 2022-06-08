const m = global.HYPER_SCRIPT
const { cls } = require('../utils')

const DEFAULT_ARROW_LENGTH = 20
const DEFAULT_CROSS_SIZE = 10
const DEFAULT_CIRCLE_RADIUS = 5
const DEFAULT_DOT_RADIUS = 2.5

const DEFAULT_ARROW_ANGLE = 7

const CLOZE_VERTICAL_POSITION_CORRECTION = 2

const px = x => `${x}px`

function noop() {}

function cos(angle) {
  return Math.cos(angle * (Math.PI / 180))
}
function sin(angle) {
  return Math.sin(angle * (Math.PI / 180))
}

function getPointByAngle(x, y, angle, radiusX, radiusY) {
  return [x + cos(angle) * radiusX, y + sin(angle) * radiusY]
}

function getArrowAngle(radiusX, radiusY, angle, scale) {
  const radiusAtAngle = Math.sqrt(
    Math.pow(cos(angle) * radiusX, 2) + Math.pow(sin(angle) * radiusY, 2)
  )
  return (DEFAULT_ARROW_ANGLE * Math.sqrt(scale) * 130) / radiusAtAngle
}

function curvedArrowView(x, y, color, options) {
  const strokeWidth = options.strokeWidth || 1
  const halfArrowWidth = 4 * Math.sqrt(strokeWidth)
  const halfStrokeWidth = strokeWidth / 2
  const baseAngle = getArrowAngle(
    options.radiusX,
    options.radiusY,
    options.angle,
    strokeWidth
  )
  const tip = [x, y]
  const direction = options.reverse ? 1 : -1
  const sweepFlag = options.reverse ? 1 : 0
  const centerTailAngle = 90 + options.angle + direction * baseAngle
  const tailTipAngle = centerTailAngle + direction * 2 * Math.sqrt(strokeWidth)
  const tipBezierAngle = 90 + options.angle + direction * (baseAngle / 4)
  const tailBezierAngle = 90 + options.angle + direction * (baseAngle * (3 / 4))
  const centerTail = getPointByAngle(
    options.centerX,
    options.centerY,
    centerTailAngle,
    options.radiusX + halfStrokeWidth,
    options.radiusY + halfStrokeWidth
  )

  const innerTipBezierDistance = halfArrowWidth / 7
  const innerTailBezierDistance = halfArrowWidth / 7

  const innerTail = getPointByAngle(
    options.centerX,
    options.centerY,
    tailTipAngle,
    options.radiusX - halfArrowWidth,
    options.radiusY - halfArrowWidth
  )
  const innerTipBezierPoint = getPointByAngle(
    options.centerX,
    options.centerY,
    tipBezierAngle,
    options.radiusX - innerTipBezierDistance,
    options.radiusY - innerTipBezierDistance
  )
  const innerTailBezierPoint = getPointByAngle(
    options.centerX,
    options.centerY,
    tailBezierAngle,
    options.radiusX - innerTailBezierDistance,
    options.radiusY - innerTailBezierDistance
  )

  return m('path', {
    d: `M ${tip[0]} ${tip[1]}
      A ${options.radiusX + halfStrokeWidth} ${
      options.radiusY + halfStrokeWidth
    } 0 0 ${sweepFlag} ${centerTail[0]} ${centerTail[1]}
      L ${innerTail[0]} ${innerTail[1]},
      C ${innerTailBezierPoint[0]} ${innerTailBezierPoint[1]} ${
      innerTipBezierPoint[0]
    } ${innerTipBezierPoint[1]} ${tip[0]} ${tip[1]},
    `,
    style: {
      fill: color,
    },
  })
}

function arrowView(x, y, color, options) {
  if (options.centerX != null) {
    return curvedArrowView(x, y, color, options)
  }
  const scale = 0.5 + (options.strokeWidth || 1) * 0.5
  const angleCorrection = options.radius ? (12 * scale) / options.radius : 0
  const { angle, l, w } = Object.assign(
    { angle: 0, l: DEFAULT_ARROW_LENGTH, w: 10 },
    options
  )

  return m('path', {
    d: `M ${x} ${y}
      c ${-l / 2}, ${-w / 8}, ${-l + w / 4}, ${-w / 4}, ${-l},${-w / 2}
        0, 0, 0, 0, ${w / 2}, ${w / 2},
        0, 0, 0, 0, ${-w / 2}, ${w / 2},
        ${w / 4}, ${-w / 4}, ${l / 2}, ${(-w * 3) / 8}, ${l}, ${-w / 2}
    `,
    style: {
      fill: color,
      transformOrigin: `${x}px ${y}px`,
      transform: `rotate(${
        angle + (options.end ? angleCorrection : -angleCorrection)
      }deg) scale(${scale})`,
    },
  })
}

function crossView(x, y, color, options = {}) {
  const { strokeWidth, crossSize, angle } = Object.assign(
    {
      angle: 0,
      strokeWidth: 2,
      crossSize:
        DEFAULT_CROSS_SIZE *
        (options.strokeWidth ? Math.sqrt(options.strokeWidth) : 1),
    },
    options
  )

  const crossLineStyle = {
    strokeWidth: px(strokeWidth),
    stroke: color,
    fill: 'none',
    transformOrigin: `${x}px ${y}px`,
    transform: `rotate(${90 - angle}deg)`,
  }

  return [
    m('path', {
      d: `
        M ${x - crossSize / 2},${y - crossSize / 2}
        l ${crossSize},${crossSize}
      `,
      style: crossLineStyle,
    }),
    m('path', {
      d: `
        M ${x + crossSize / 2},${y - crossSize / 2}
        l ${-crossSize},${crossSize}
      `,
      style: crossLineStyle,
    }),
  ]
}

function barView(x, y, color, options = {}) {
  const { strokeWidth, crossSize, angle } = Object.assign(
    {
      angle: 0,
      strokeWidth: 2,
      crossSize:
        DEFAULT_CROSS_SIZE *
        (options.strokeWidth ? Math.sqrt(options.strokeWidth) : 1),
    },
    options
  )

  const crossLineStyle = {
    strokeWidth: px(strokeWidth),
    stroke: color,
    fill: 'none',
    transformOrigin: `${x}px ${y}px`,
    transform: `rotate(${angle}deg)`,
  }

  return [
    m('path', {
      d: `
        M ${x},${y - crossSize / 2}
        l ${0},${crossSize}
      `,
      style: crossLineStyle,
    }),
  ]
}

function circleView(x, y, color, options = {}) {
  const { strokeWidth, radius } = Object.assign(
    {
      strokeWidth: 2,
      radius:
        DEFAULT_CIRCLE_RADIUS *
        (options.strokeWidth ? Math.sqrt(options.strokeWidth) : 1),
    },
    options
  )

  return m('circle', {
    cx: x,
    cy: y,
    r: radius,
    style: {
      strokeWidth: px(strokeWidth),
      stroke: color,
      fill: 'none',
    },
  })
}

function dotView(x, y, color, options = {}) {
  const radius =
    options.radius ||
    DEFAULT_DOT_RADIUS *
      (options.strokeWidth ? Math.sqrt(options.strokeWidth) : 1)

  return m('circle', {
    cx: x,
    cy: y,
    r: radius,
    style: {
      fill: color,
      strokeWidth: options.strokeWidth,
      stroke: color,
    },
  })
}

const typeViewMap = {
  arrow: arrowView,
  cross: crossView,
  circle: circleView,
  dot: dotView,
  bar: barView,
  none: noop,
}

function formView(type, x, y, color, options) {
  const view = typeViewMap[type] || noop
  if (view) {
    return view(x, y, color, options)
  }
}

const clozeWidth = 12
const clozeHeight = 30
function clozeView(x, y, label, options) {
  options = Object.assign(
    {
      vertical: 'center',
      horizontal: 'center',
    },
    options
  )
  if (!options.cloze) {
    return textView(x, y, label, options)
  }

  const width = clozeWidth * (label.length + 1)
  const height = clozeHeight

  const offsetX = {
    left: 0,
    center: -width / 2,
    right: -width,
  }[options.horizontal]

  const offsetY = {
    top: 0,
    center: -height / 2,
    bottom: -height,
  }[options.vertical]

  return [
    options.cloze &&
      m('rect.cloze', {
        x: x + offsetX,
        y: y + offsetY,
        width,
        height,
        rx: '5px',
        ry: '5px',
        stroke: options.color,
        style: options.style,
      }),
    options.showSolution &&
      textView(
        x + offsetX + width / 2,
        y + offsetY + height / 2 + CLOZE_VERTICAL_POSITION_CORRECTION,
        label,
        Object.assign({}, options, {
          className: 'clozeText',
          color: '#666666',
          autoBackground: false,
          horizontal: 'center',
          vertical: 'center',
        })
      ),
  ]
}

function textView(x, y, label, options) {
  return m(
    'text',
    {
      x,
      y,
      style: Object.assign(
        {
          fill: options.color || 'black',
          stroke: options.autoBackground === false ? 'none' : null,
        },
        options.style
      ),
      className: cls({
        [options.className]: options.className,
        verticalTop: options.vertical === 'top',
        verticalCenter: options.vertical === 'center',
        verticalBottom: options.vertical === 'bottom',
        horizontalLeft: options.horizontal === 'left',
        horizontalCenter: options.horizontal === 'center',
        horizontalRight: options.horizontal === 'right',
      }),
    },
    label
  )
}

function group(attrs, els) {
  return m('g', attrs, els)
}

module.exports = {
  formView,
  clozeView,

  arrowView,
  arrowLength: DEFAULT_ARROW_LENGTH,
  getArrowAngle,

  circleView,
  circleRadius: DEFAULT_CIRCLE_RADIUS,

  dotView,
  dotRadius: DEFAULT_DOT_RADIUS,

  crossView,
  crossSize: DEFAULT_CROSS_SIZE,

  group,
}
