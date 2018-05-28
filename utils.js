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

module.exports = {
  toInt,
  times,
}
