/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  let last_char = '',
      counter   = 1
  return [...string].filter((char) => {
      let result
      if (
          last_char !== char && counter <= size) {
          counter = 1
          last_char = char
          result = char
      } else {
          if (counter >= size) {
            result = false
          } else {
              counter++
              result = char
          }
      }
      return result
    })
    .join('')
}
