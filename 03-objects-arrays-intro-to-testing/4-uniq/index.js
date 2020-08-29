/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr = []) {
  // для прохождения теста на "пустой аргумент" - добавил параметр по умолчанию,
  // но вроде же исходный код менять нельзя?
  return arr.filter((val, index) => {
    return arr.indexOf(val) === index;
  })
}
