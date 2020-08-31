/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    const pathArr = path.split('.')//сохраним путь в замыкании
    return function (obj) {
        // принимаем объект и идем по нему "вниз"
        // на каждой итерации в "аккумуляторе" получаем новый "обрезанный" объект
        // смотрим есть ли искомое свойство уже у него
        return pathArr.reduce((this_obj, key) => {
            return this_obj !== undefined && this_obj.hasOwnProperty(key)
                ? this_obj[key]
                : undefined
        }, obj)
    }
}
