/* JavaScript FRONT
 * Project: GameBox
 * Package: resources
 * Module: utils
 * Usage: General utility functions.
 * Date: 23/12/2023
 * author: BoxBoxJason
 */

/**
 * Returns the basename of a path
 * @param {string} path 
 * @returns {string} basename of the path
 */
export function basename(path) {
    return path.split('/').pop();
}

/**
 * Returns the sum of the array elements
 * @param {Array<any>} array 
 * @returns {number} sum of the array elements
 */
export function sum(array){
    const sum = array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return sum;
}