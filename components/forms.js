const m = require('mithril')
const AW = 10
const AL = 20

function arrowView(x, y, rot, fill) {
  return m('path', {
    d: `M ${x} ${y}
    c ${-AW / 8}, ${AL / 2}, ${-AW / 4}, ${AL + -AW / 4}, ${-AW / 2}, ${AL}
      0, 0, 0, 0, ${AW / 2}, ${-AW / 4}
      0, 0, 0, 0, ${AW / 2}, ${AW / 4}
      ${-AW / 4}, ${-AW / 4}, ${(3 * -AW) / 8}, ${-AL / 2}, ${-AW / 2}, ${-AL}
    `,
    style: {
      fill,
      transformOrigin: `${x}px ${y}px`,
      transform: `rotate(${rot}rad)`,
    },
  })
}

module.exports = {
  arrowView,
  arrowLength: AL,
}
