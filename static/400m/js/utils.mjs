/* JavaScript FRONT
 * Project: 400m
 * Package: js
 * Module: utils
 * Usage: utility functions.
 * Date: 15/11/2023
 * author: BoxBoxJason
 */

/**
 * Returns the sum of the array elements
 * @param {Array<any>} array 
 * @returns {number} sum of the array elements
 */
export function sum(array){
    const sum = array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return sum;
}