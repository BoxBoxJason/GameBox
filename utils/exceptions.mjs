/* JavaScript
 * Project: GameBox
 * Package: utils
 * Module: exceptions
 * Usage: Custom Exceptions classes.
 * Date: 09/12/2023
 * author: BoxBoxJason
 */
export class InvalidArgumentException extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidArgumentException';
    }
}


export class NotUniqueDatabaseRowException extends Error {
    constructor(message){
        super(message);
        this.name = 'NotUniqueDatabaseRowException';
    }
}


export class AuthFailedException extends Error {
    constructor(message){
        super(message);
        this.name = 'AuthFailedException';
    }
}