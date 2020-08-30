/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
    
    // "структура данных Set хранит только уникальные значения"
    // интересно бы заглянуть внутрь конструктора Set, посмотреть как он обеспечивает уникальность
    return [...(new Set(arr))]
    
    
    // в теории есть еще такое решение, оно мне нравится логически интересным, вроде тоже работает
    
    // return arr.filter((val, index) => {
    //   return arr.indexOf(val) === index;
    // })
}
