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
        stepLabelsX: 1,
        stepLabelsY: 1,
        stepGridX: 1,
        stepGridY: 1,
        grid: true,
        labelY: 'f(x)',
      },
      dimensions
    ),
  },
  // {
  //   type: 'function',
  //   args: Object.assign(
  //     {
  //       fn: x => Math.tan(x),
  //       color: 'green',
  //     },
  //     dimensions
  //   ),
  // },
  {
    type: 'function',
    args: Object.assign(
      {
        fn: x => Math.sin(x),
        label: 'sin(x)',
        labelX: (x, y) =>
          m(
            'foreignObject',
            { x, y, width: 100, height: 100 },
            m(
              'body',
              {
                xmlns: 'http://www.w3.org/1999/xhtml',
              },
              m('div', 'huhu')
            )
          ),
        labelX: 5,
        color: 'turquoise',
      },
      dimensions
    ),
  },
  {
    type: 'function',
    args: Object.assign({
      fn: x => Math.sin(x),
      label: 'G(x)',
      color: 'turquoise',
      fill: 'paleturquoise',
      startX: 7,
      endX: 9,
      startY: -10,
      endY: 10,
    }),
  },
  {
    type: 'function',
    args: Object.assign(
      {
        fn: x => 1 / x,
        label: 'f(x)',
        cloze: true,
        labelY: 1,
        color: 'blue',
        strokeDasharray: '8 4 2 4',
      },
      dimensions
    ),
  },
  {
    type: 'circle',
    args: {
      centerX: 5,
      centerY: 5,
      radius: 1,
      fill: 'silver',
      color: 'black',
      label: 'rund',
      strokeWidth: 1,
      strokeDasharray: '8 4 2 4',
    },
  },
  {
    type: 'ellipse',
    args: {
      centerX: 3,
      centerY: 7,
      radiusX: 1,
      radiusY: 0.5,
      label: 'A',
      cloze: true,
      fill: 'greenyellow',
      color: 'green',
      strokeWidth: 1,
    },
  },
  {
    type: 'polygon',
    args: {
      points: [[5, 8], [6, 6], [7, 7], [7, 8]],
      label: 'polygon',
      cloze: true,
      labelY: 8.5,
      fill: 'coral',
      color: 'crimson',
      strokeWidth: 1,
    },
  },
  {
    type: 'line',
    args: {
      label: 'S',
      cloze: true,
      startX: 1,
      startY: 5,
      endX: 2,
      endY: 1,
      startForm: 'bar',
      endForm: 'bar',
    },
  },
  {
    type: 'line',
    args: {
      label: 'T',
      startX: 5,
      startY: 3,
      endX: 2,
      endY: 5,
      color: 'brown',
      endForm: 'arrow',
    },
  },
  {
    type: 'line',
    args: {
      label: 'U',
      startX: 4,
      startY: -1,
      endX: 6,
      endY: 3,
      startForm: 'cross',
      endForm: 'arrow',
      color: 'purple',
    },
  },
  {
    type: 'point',
    args: {
      x: -1,
      y: 1,
      label: 'P',
      cloze: true,
    },
  },
  {
    type: 'point',
    args: {
      x: -1,
      y: 2,
      label: 'Q',
      color: 'green',
      form: 'circle',
    },
  },
  {
    type: 'point',
    args: {
      x: -1,
      y: 3,
      label: 'R',
      color: 'red',
      form: 'dot',
    },
  },
  {
    type: 'label',
    args: {
      x: 4,
      y: 2,
      rotate: 20,
      label: 'Huhu',
      cloze: true,
      horizontalAnchor: 'center',
      verticalAnchor: 'center',
    },
  },
  {
    type: 'arc',
    args: {
      centerX: 8,
      centerY: 5,
      radius: 2,
      startAngle: 70,
      endAngle: 90,
      keepAspect: true,
      endForm: 'arrow',
      fill: 'lightblue',
      color: 'blue',
      label: 'α',
      strokeWidth: 1,
    },
  },
  {
    type: 'arc',
    args: {
      centerX: 8,
      centerY: 2,
      radius: 1,
      startAngle: 220,
      endAngle: 180,
      keepAspect: true,
      startForm: 'arrow',
      endForm: 'bar',
      fill: 'lightblue',
      color: 'blue',
      label: 'α',
      cloze: true,
      strokeWidth: 1,
    },
  },
]

const types = {
  coord: require('./components/coord'),
  circle: require('./components/circle'),
  ellipse: require('./components/circle'),
  function: require('./components/function'),
  polygon: require('./components/polygon'),
  line: require('./components/line'),
  point: require('./components/point'),
  arc: require('./components/arc'),
  label: require('./components/label'),
}

m.mount(document.body, {
  view({ state }) {
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
    const scaleY = 50
    const renderedShapes = shapes.map(shape =>
      types[shape.type].render(shape.args, {
        offsetX: -minX,
        offsetY: maxY,
        scaleX,
        scaleY,
        showSolution: state.showSolution,
      })
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
        text {
          font-size: 15px;
          stroke: white;
          stroke-width: 7px;
          paint-order: stroke fill;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        text.horizontalLeft {
          text-anchor: start;
        }
        text.horizontalCenter {
          text-anchor: middle;
        }
        text.horizontalRight {
          text-anchor: end;
        }
        text.verticalTop {
          alignment-baseline: hanging;
        }
        text.verticalCenter {
          alignment-baseline: middle;
        }
        text.verticalBottom {
          alignment-baseline: baseline;
        }
        .cloze {
          fill: #DDDDDD;
          fill-opacity: 0.8;
        }
      `
      ),
      m(
        'svg',
        {
          width: `${(maxX - minX) * scaleX}px`,
          height: `${(maxY - minY) * scaleY}px`,
          onmouseenter: () => (state.showSolution = true),
          onmouseleave: () => (state.showSolution = false),
        },
        renderedShapes
      ),
    ]
  },
})
