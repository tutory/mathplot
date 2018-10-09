const m = global.HYPER_SCRIPT

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

const ONE_CM_PER_UNIT = 37.8

module.exports = function view(
  shapes,
  { showSolution, scaleX, scaleY },
  attrs = {}
) {
  scaleX = scaleX || ONE_CM_PER_UNIT
  scaleY = scaleY || ONE_CM_PER_UNIT
  const minX = Math.min(
    ...shapes.map(shape => types[shape.type].getMinX(shape))
  )
  const maxX = Math.max(
    ...shapes.map(shape => types[shape.type].getMaxX(shape))
  )
  const minY = Math.min(
    ...shapes.map(shape => types[shape.type].getMinY(shape))
  )
  const maxY = Math.max(
    ...shapes.map(shape => types[shape.type].getMaxY(shape))
  )
  const offsetX = -minX
  const offsetY = maxY
  const renderedShapes = shapes.map(shape =>
    types[shape.type].render(shape.args, {
      offsetX,
      offsetY,
      scaleX,
      scaleY,
      offScaleX: x => scaleX * (offsetX + x),
      offScaleY: y => scaleY * (offsetY - y),
      showSolution: showSolution == null ? true : false,
    })
  )

  return [
    m(
      'style',
      `
        svg.mathplot .axisLabel {
          font-style: italic;
        }
        svg.mathplot text {
          stroke: white;
          stroke-width: 7px;
          paint-order: stroke fill;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        svg.mathplot text.horizontalLeft {
          text-anchor: start;
        }
        svg.mathplot text.horizontalCenter {
          text-anchor: middle;
        }
        svg.mathplot text.horizontalRight {
          text-anchor: end;
        }
        svg.mathplot text.verticalTop {
          alignment-baseline: hanging;
        }
        svg.mathplot text.verticalCenter {
          alignment-baseline: middle;
        }
        svg.mathplot text.verticalBottom {
          alignment-baseline: baseline;
        }
        svg.mathplot .cloze {
          fill: white;
          fill-opacity: 1;
        }
      `
    ),
    m(
      'svg.mathplot',
      Object.assign(
        {
          width: `${(maxX - minX) * scaleX}px`,
          height: `${(maxY - minY) * scaleY}px`,
        },
        attrs
      ),
      renderedShapes
    ),
  ]
}
