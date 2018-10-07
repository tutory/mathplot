const m = require('mithril')

const DEFAULT_ARROW_LENGTH = 20
const DEFAULT_CROSS_SIZE = 10
const DEFAULT_CIRCLE_RADIUS = 5
const DEFAULT_DOT_RADIUS = 2.5

const px = x => `${x}px`

function arrowView(x, y, color, options) {
  const { angle, l, w } = Object.assign(
    { angle: 0, l: DEFAULT_ARROW_LENGTH, w: 10 },
    options
  )
  return m('path', {
    d: `M ${x} ${y}
    c ${-w / 8}, ${l / 2}, ${-w / 4}, ${l - w / 4}, ${-w / 2}, ${l}
      0, 0, 0, 0, ${w / 2}, ${-w / 4}
      0, 0, 0, 0, ${w / 2}, ${w / 4}
      ${-w / 4}, ${-w / 4}, ${(3 * -w) / 8}, ${-l / 2}, ${-w / 2}, ${-l}
    `,
    style: {
      fill: color,
      transformOrigin: `${x}px ${y}px`,
      transform: `rotate(${angle}deg)`,
    },
  })
}

function crossView(x, y, color, options) {
  const { strokeWidth, crossSize, angle } = Object.assign(
    { angle: 0, strokeWidth: 2, crossSize: DEFAULT_CROSS_SIZE },
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

function barView(x, y, color, options) {
  const { strokeWidth, crossSize, angle } = Object.assign(
    { angle: 0, strokeWidth: 2, crossSize: DEFAULT_CROSS_SIZE },
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
        M ${x - crossSize / 2},${y}
        l ${crossSize},${0}
      `,
      style: crossLineStyle,
    }),
  ]
}

function circleView(x, y, color, options) {
  const { strokeWidth, radius } = Object.assign(
    { strokeWidth: 1, radius: DEFAULT_CIRCLE_RADIUS },
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
  const radius = options.radius || DEFAULT_DOT_RADIUS

  return m('circle', {
    cx: x,
    cy: y,
    r: radius,
    style: {
      fill: color,
    },
  })
}

const typeViewMap = {
  arrow: arrowView,
  cross: crossView,
  circle: circleView,
  dot: dotView,
  bar: barView,
}

function formView(type, x, y, color, options) {
  const view = typeViewMap[type]
  if (view) {
    return view(x, y, color, options)
  }
}

module.exports = {
  formView,

  arrowView,
  arrowLength: DEFAULT_ARROW_LENGTH,

  circleView,
  circleRadius: DEFAULT_CIRCLE_RADIUS,

  dotView,
  dotRadius: DEFAULT_DOT_RADIUS,

  crossView,
  crossSize: DEFAULT_CROSS_SIZE,
}
