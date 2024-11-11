function toInt(str) {
  return parseInt(str, 10)
}

function times(n) {
  const arr = []
  for (let i = 0; i < n; i++) {
    arr.push(i)
  }
  return arr
}

function last(arr) {
  return arr[arr.length - 1]
}

function cls(def, separator = ' ') {
  let classes
  for (const cls in def) {
    if (def[cls]) {
      classes = classes == null ? cls : classes + separator + cls
    }
  }
  return classes || ''
}

function clamp(min, max, x) {
  if (x < min) return min
  if (x > max) return max
  return x
}

function min(...args) {
  return Math.min(...args.filter(a => a != null))
}

function max(...args) {
  return Math.max(...args.filter(a => a != null))
}

function isFunction(a) {
  return typeof a === 'function'
}

module.exports = {
  clamp,
  cls,
  isFunction,
  last,
  max,
  min,
  times,
  toInt,
}
