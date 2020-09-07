/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  return [...arr].sort((a, b) => {
      return compareStrings(a, b, param)
  })
}

export function compareStrings(a, b, order){
    return new Intl.Collator('ru', {caseFirst: 'upper'})
        .compare(
            ...(order === 'asc' ? [a, b] : [b, a])
        )
}