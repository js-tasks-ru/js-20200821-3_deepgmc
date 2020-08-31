/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    let last_char = '',
        counter   = 1
    // идём побуквенно, запоминаем предыдущий символ,
    // при смене "состояния" - с одной буквы на другую обнуляем счетчик
    return [...string].filter((char) => {
        if (last_char !== char && counter <= size) {
            counter = 1
            last_char = char
            return char
        } else {
            if (counter >= size) {
                return false
            } else {
                counter++
                return char
            }
        }
    })
    .join('')
}
