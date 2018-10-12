const m = (global.HYPER_SCRIPT = require('mithril'))
const mathPlot = require('../index')

const dimensions = {
  startX: -10,
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
        labelY: 'f(x)',
        labelX: 'x',
        unitX: 'm',
      },
      dimensions
    ),
  },
  {
    type: 'function',
    args: Object.assign(
      {
        fn: x => Math.sin(x),
        label: 'sin(x)',
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
      endY: -10,
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
      x: 8,
      y: 5,
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
      x: 8,
      y: 2,
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
      strokeWidth: 3,
    },
  },
]

m.mount(document.body, {
  view({ state }) {
    return mathPlot(shapes, {
      showSolution: state.showSolution,
      onmouseenter: () => (state.showSolution = true),
      onmouseleave: () => (state.showSolution = false),
    })
  },
})
