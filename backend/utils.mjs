/* Node.js BACKEND
 * Project: 
 * Package:
 * Module:
 * Usage: 
 * Date: 
 * author: BoxBoxJason
 */

/**
 * Separates a dict into its keys array and values array, preserves the order.
 * @param {Object<any,any>} dict - Dictionary that needs to be separated and maintain order
 * @returns Array<Array<any>> - Keys array, Values array
 */
export function getKeysValuesOrderedArrays(dict){
    const keys = Object.keys(dict);
    const values = keys.map(key => dict[key]);
    return [keys,values];
}
