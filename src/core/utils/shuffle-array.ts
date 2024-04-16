export function shuffleArray<T> (array: T[]) {
  function compare () {
    return Math.random() - 0.5
  }

  return array.sort(compare)
}
