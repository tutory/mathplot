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

module.exports = {
  toInt,
  times,
  last,
  cls,
  clamp,
}
