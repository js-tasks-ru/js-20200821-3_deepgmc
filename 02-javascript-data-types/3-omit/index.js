/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  const ret = {}
  for(let key in obj){
    if(!fields.find(name => name === key)) ret[key] = obj[key]
  }
  return ret
};
