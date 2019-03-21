const m = global.HYPER_SCRIPT
const { times, last, clamp, min, max } = require('../utils')
const { clozeView } = require('./forms')

const PRECISION = 10
const NO_FILL = 'none'

function groupPoints(points, minY, maxY, fill) {
  return points
    .reduce(
      (groups, point) => {
        let [x, y] = point
        if (typeof y !== 'number') {
          return groups
        }
        if (fill !== NO_FILL) {
          y = clamp(minY, maxY, y)
        }
        const currentGroup = last(groups)
        if (y >= minY && y <= maxY) {
          currentGroup.push([x, y])
        } else if (currentGroup.length > 1) {
          currentGroup.push([x, clamp(minY, maxY, y)])
          groups.push([])
        } else {
          currentGroup[0] = [x, clamp(minY, maxY, y)]
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
      strokeWidth: 1,
      strokeDasharray: null,
    },
    args
  )

  function graphView() {
    const points = times((args.endX - args.startX) * PRECISION * scaleX).map(
      i => [
        args.startX + i / PRECISION / scaleX,
        args.fn(args.startX + i / PRECISION / scaleX),
      ]
    )
    const pointGroups = groupPoints(points, args.startY, args.endY, args.fill)
    const isFilled = args.fill && args.fill !== NO_FILL
    if (isFilled) {
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
          (isFilled ? 'Z' : ''),
        style: {
          strokeWidth: `${args.strokeWidth}px`,
          fill: args.fill || NO_FILL,
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
