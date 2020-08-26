/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {ObjectConstructor}
 */
export function sortStrings(arr, param = 'asc') {
  const collator = new Intl.Collator('ru', {
    usage    : 'sort',
    caseFirst: 'upper',
  })
  const ret = [...arr].sort(collator.compare)
  return param === 'desc' ? ret.reverse() : ret
}
