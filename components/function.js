const m = require('mithril')
const { times, last } = require('../utils')

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
  const labelX = (args.startX + args.endX) / 2
  args = Object.assign(
    {
      labelX,
      labelY: args.fn(labelX) / (args.fill ? 2 : 1),
      color: 'green',
      strokeDasharray: null,
    },
    args
  )

  function graphView() {
    const points = times((args.endX - args.startX) * scaleX).map(i => [
      args.startX + i / scaleX,
      args.fn(args.startX + i / scaleX),
    ])
    const pointGroups = groupPoints(points, args.startY, args.endY)
    if (args.fill) {
      pointGroups.map(points => {
        points.unshift([points[0][0], 0])
        points.push([last(points)[0], 0])
      })
    }

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
            .join(' ') +
          (args.fill ? 'Z' : ''),
        style: {
          strokeWidth: '2px',
          fill: args.fill || 'none',
          stroke: args.color,
          strokeDasharray: args.strokeDasharray,
        },
      })
    )
  }

  function labelView() {
    if (args.label) {
      return m(
        'text.verticalCenter.horizontalCenter',
        {
          x: scaleX * (offsetX + args.labelX),
          y: scaleY * (offsetY - args.labelY),
          style: {
            fill: args.color,
            fontStyle: 'italic',
            fontWeight: 'bold',
            stroke: args.fill && 'none',
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
