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

module.exports = function view(shapes, attrs) {
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
  const scaleX = 50
  const scaleY = 50
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
      showSolution: attrs.showSolution,
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
          fill: white;
          fill-opacity: 1;
        }
      `
    ),
    m(
      'svg',
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
