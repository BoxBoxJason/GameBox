/* JavaScript FRONT
 * Project: 400m
 * Package: js
 * Module: utils
 * Usage: utility functions.
 * Date: 15/11/2023
 * author: BoxBoxJason
 */

export function sum(array){
    // Returns the sum of all the values in an array
    const sum = array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return sum;
}