const m = global.HYPER_SCRIPT
const { times, last, clamp, min, max } = require('../utils')
const { clozeView } = require('./forms')

function groupPoints(points, minY, maxY) {
  return points
    .reduce(
      (groups, point) => {
        const y = point[1]
        const currentGroup = last(groups)
        if (y > minY && y < maxY) {
          currentGroup.push(point)
        } else if (currentGroup.length > 1) {
          currentGroup.push([point[0], clamp(minY, maxY, y)])
          groups.push([])
        } else {
          currentGroup[0] = [point[0], clamp(minY, maxY, y)]
        }
        return groups
      },
      [[]]
    )
    .filter(p => p.length)
}

function view(args, { offScaleX, offScaleY, scaleX, showSolution }) {
  const labelX =
    args.labelX == null ? (args.startX + args.endX) / 2 : args.labelX
  args = Object.assign(
    {
      labelX,
      labelY: clamp(
        args.startY + 1,
        args.endY - 1,
        args.fn(labelX) / (args.fill ? 2 : 1)
      ),
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
            .map(point => `${offScaleX(point[0])},${offScaleY(point[1])}`)
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
    if (!args.label) return
    return clozeView(
      offScaleX(args.labelX),
      offScaleY(args.labelY),
      args.label,
      {
        color: args.color,
        autoBackground: !args.fill,
        cloze: args.cloze,
        showSolution,
        style: {
          fontStyle: 'italic',
          fontWeight: 'bold',
        },
      }
    )
  }

  return [graphView(), labelView()]
}

module.exports = {
  view,
  getDimensions: ({ args }) => [
    min(args.labelX, args.startX),
    max(args.labelX, args.endX),
    min(args.labelY, args.startY),
    max(args.labelY, args.endY),
  ],
}
