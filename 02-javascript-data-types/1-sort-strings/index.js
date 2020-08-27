/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {ObjectConstructor}
 */
export function sortStrings(arr, param = 'asc') {
  const ret = [...arr].sort(new Intl.Collator('ru', {caseFirst: 'upper'}).compare)
  return param === 'desc' ? ret.reverse() : ret
}
