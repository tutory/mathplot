const m = (global.HYPER_SCRIPT = require('mithril'))
const mathPlot = require('../index')

const dimensions = {
  startX: -10,
  startY: -10,
  endX: 10,
  endY: 10,
}

const sf = 'cross'
const ef = 'bar'

shapes = [
  {
    type: 'coord',
    args: Object.assign(
      {
        stepLabelsX: 1,
        stepLabelsY: 1,
        stepGridX: 1,
        stepGridY: 1,
        labelY: 'f(x)',
        labelX: 'x',
        unitX: 'm',
        gridStrokeDasharray: '2 2',
      },
      dimensions
    ),
  },
  {
    type: 'function',
    args: Object.assign(
      {
        fn: x => Math.tan(0.1 * x * x),
        label: 'tan(x*x)',
        color: 'turquoise',
      },
      dimensions
    ),
  },
  {
    type: 'function',
    args: Object.assign({
      fn: x => 1 / x,
      label: 'G(x)',
      color: 'turquoise',
      fill: 'paleturquoise',
      startX: -10,
      endX: 10,
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
        labelX: 1,
        cloze: true,
        color: 'blue',
        strokeDasharray: '8 4 2 4',
      },
      dimensions
    ),
  },
  {
    type: 'circle',
    args: {
      x: 5,
      y: 5,
      radius: 1,
      fill: 'silver',
      color: 'black',
      label: 'rund',
      centerForm: 'cross',
      strokeWidth: 1,
      strokeDasharray: '8 4 2 4',
    },
  },
  {
    type: 'ellipse',
    args: {
      x: 3,
      y: 7,
      radiusX: 1,
      radiusY: 0.5,
      label: 'A',
      cloze: true,
      centerForm: 'bar',
      fill: 'greenyellow',
      color: 'green',
      strokeWidth: 1,
    },
  },
  {
    type: 'polygon',
    args: {
      points: [
        { x: 5, y: 8, label: 'A' },
        { x: 6, y: 6, label: 'B' },
        { x: 7, y: 7, label: 'C', form: 'cross' },
        { x: 7, y: 8, label: 'D', cloze: true },
      ],
      // label: 'polygon',
      cloze: false,
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
      startForm: 'arrow',
    },
  },
  {
    type: 'line',
    args: {
      label: 'U',
      startX: 4,
      startY: -1,
      endX: 4,
      endY: -4,
      startForm: sf,
      endForm: ef,
      color: 'purple',
      strokeWidth: 2,
    },
  },
  {
    type: 'line',
    args: {
      label: 'U',
      startX: 5,
      startY: -1,
      endX: 5,
      endY: -4,
      startForm: sf,
      endForm: ef,
      color: 'purple',
      strokeWidth: 1,
    },
  },
  {
    type: 'line',
    args: {
      label: 'U',
      startX: 6,
      startY: -1,
      endX: 6,
      endY: -4,
      startForm: sf,
      endForm: ef,
      color: 'purple',
      strokeWidth: 0.5,
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
      rotation: 20,
      label: 'Huhu',
      cloze: true,
      horizontalAnchor: 'center',
      verticalAnchor: 'center',
    },
  },
  {
    type: 'arc',
    args: {
      x: 8,
      y: 5,
      radius: 2,
      startAngle: 70,
      endAngle: 90,
      keepAspect: true,
      drawRadii: true,
      startForm: 'arrow',
      endForm: 'bar',
      fill: 'lightblue',
      color: 'blue',
      label: 'α',
      strokeWidth: 1,
    },
  },
  {
    type: 'arc',
    args: {
      x: 0,
      y: 2,
      radius: 1,
      startAngle: 28,
      endAngle: 198,
      keepAspect: true,
      startForm: 'arrow',
      endForm: 'bar',
      fill: 'lightblue',
      color: 'blue',
      label: 'α',
      cloze: true,
      strokeWidth: 3,
    },
  },
  {
    type: 'rect',
    args: {
      x: -12,
      y: -6,
      width: 10,
      height: 3,
      rotation: 175,
      fill: 'lightblue',
      color: 'blue',
      label: 'rect',
      cloze: false,
      strokeWidth: 1,
    },
  },
]

m.mount(document.body, {
  view({ state }) {
    return mathPlot(
      shapes,
      {
        showSolution: state.showSolution,
        padding: 10,
      },
      {
        onmouseenter: () => (state.showSolution = true),
        onmouseleave: () => (state.showSolution = false),
      }
    )
  },
})
