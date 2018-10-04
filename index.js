const m = require('mithril')

shapes = [
  {
    type: 'coord',
    args: {
      startX: -3,
      startY: -10,
      endX: 8,
      endY: 10,
      stepX: 2,
      stepY: 1,
      grid: true,
    },
  },
  {
    type: 'function',
    args: {
      startX: -10,
      endX: 10,
      startY: -10,
      endY: 10,
      fn: x => Math.tan(x),
      color: 'green',
    },
  },
  {
    type: 'function',
    args: {
      startX: -10,
      endX: 10,
      startY: -10,
      endY: 10,
      fn: x => Math.sin(x) * 11,
      color: 'turquoise',
    },
  },
  {
    type: 'function',
    args: {
      startX: -10,
      endX: 10,
      startY: -10,
      endY: 10,
      fn: x => 1 / x,
      color: 'blue',
    },
  },
  {
    type: 'circle',
    args: {
      centerX: -13,
      centerY: 30,
      radius: 1,
      fill: 'silver',
      stroke: 'black',
      strokeWidth: 1,
    },
  },
]

const types = {
  coord: require('./components/coord'),
  circle: require('./components/circle'),
  function: require('./components/function'),
}

m.mount(document.body, {
  view(vnode) {
    shapes = shapes.map(shape => {
      if (shape.type) {
        return shape
      }
      const [type, ...args] = shape.split(' ')
      return { type, args: types[type].parse(args) }
    })

    const minX = shapes.reduce((minX, shape) => {
      return Math.min(minX, types[shape.type].getMinX(shape))
    }, Infinity)
    const maxX = shapes.reduce((maxX, shape) => {
      return Math.max(maxX, types[shape.type].getMaxX(shape))
    }, -Infinity)
    const minY = shapes.reduce((minY, shape) => {
      return Math.min(minY, types[shape.type].getMinY(shape))
    }, Infinity)
    const maxY = shapes.reduce((maxY, shape) => {
      return Math.max(maxY, types[shape.type].getMaxY(shape))
    }, -Infinity)
    const scaleX = 50
    const scaleY = 30
    const renderedShapes = shapes.map(shape =>
      types[shape.type].render(-minX, maxY, scaleX, scaleY, shape.args)
    )

    return m(
      'svg',
      {
        style: {
          fontFamily: 'open sans',
        },
        width: `${(maxX - minX) * scaleX}px`,
        height: `${(maxY - minY) * scaleY}px`,
      },
      renderedShapes
    )
  },
})
