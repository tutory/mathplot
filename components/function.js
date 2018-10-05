const m = require('mithril')
const { times } = require('../utils')

function groupPoints(points, minY, maxY) {
  return points.reduce(
    (groups, point) => {
      const y = point[1]
      const currentGroup = groups[groups.length - 1]
      if (y > minY && y < maxY) {
        currentGroup.push(point)
      } else if (currentGroup.length !== 0) {
        groups.push([])
      }
      return groups
    },
    [[]]
  )
}

function render(offsetX, offsetY, scaleX, scaleY, args) {
  args = Object.assign(
    {
      labelX: 0,
      labelY: args.fn(args.labelX || 0),
    },
    args
  )

  function graphView() {
    const points = times((args.endX - args.startX) * scaleX).map(i => [
      args.startX + i / scaleX,
      args.fn(args.startX + i / scaleX),
    ])
    const pointGroups = groupPoints(points, args.startY, args.endY)
    return pointGroups.map(points =>
      m('path', {
        d:
          'M' +
          points
            .map(
              point =>
                `${scaleX * (point[0] + offsetX)},${scaleY *
                  (offsetY - point[1])}`
            )
            .join(' '),
        style: {
          strokeWidth: '2px',
          fill: 'none',
          stroke: args.color || 'green',
        },
      })
    )
  }

  function labelView() {
    if (args.label) {
      return m(
        'text',
        {
          x: scaleX * (offsetX + args.labelX),
          y: scaleY * (offsetY - args.labelY),
          style: {
            fill: args.color,
            textAnchor: 'middle',
            alignmentBaseline: 'middle',
            fontStyle: 'italic',
            fontWeight: 'bold',
          },
        },
        args.label
      )
    }
  }

  return [graphView(), labelView()]
}

module.exports = {
  render,
  getMinX: ({ args }) => args.startX,
  getMaxX: ({ args }) => args.endX,
  getMinY: ({ args }) => args.startY,
  getMaxY: ({ args }) => args.endY,
}
