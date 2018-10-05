const m = require('mithril')

const dimensions = {
  startX: -3,
  startY: -10,
  endX: 10,
  endY: 10,
}

shapes = [
  {
    type: 'coord',
    args: Object.assign(
      {
        stepLabelsX: Math.PI / 2,
        stepLabelsY: 1,
        stepX: Math.PI / 4,
        stepY: 1,
        grid: true,
        labelY: 'f(x)',
        labelXView: x => `${x / Math.PI === 1 ? '' : x / Math.PI}π`,
      },
      dimensions
    ),
  },
  {
    type: 'function',
    args: Object.assign(
      {
        fn: x => Math.tan(x),
        color: 'green',
      },
      dimensions
    ),
  },
  {
    type: 'function',
    args: Object.assign(
      {
        fn: x => Math.sin(x),
        color: 'turquoise',
      },
      dimensions
    ),
  },
  {
    type: 'function',
    args: Object.assign(
      {
        fn: x => 1 / x,
        color: 'blue',
      },
      dimensions
    ),
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
  {
    type: 'polygon',
    args: {
      points: [[0, 0], [1, 1], [-1, 1]],
    },
  },
]

const types = {
  coord: require('./components/coord'),
  circle: require('./components/circle'),
  function: require('./components/function'),
  polygon: require('./components/polygon'),
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
    const scaleX = 20 * Math.PI
    const scaleY = 50
    const renderedShapes = shapes.map(shape =>
      types[shape.type].render(-minX, maxY, scaleX, scaleY, shape.args)
    )

    return [
      m(
        'style',
        `
        svg {
          font-family: "Latin Modern Roman", "open sans";
        }
        .axisLabel {
          font-style: italic;
        }
      `
      ),
      m(
        'svg',
        {
          width: `${(maxX - minX) * scaleX}px`,
          height: `${(maxY - minY) * scaleY}px`,
        },
        renderedShapes
      ),
    ]
  },
})
