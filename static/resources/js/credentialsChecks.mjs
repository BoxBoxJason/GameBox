/* JavaScript
 * Project: 
 * Package:
 * Module:
 * Usage: 
 * Date: 
 * author: BoxBoxJason
 */

export function checkPasswordFormat(password){return /^(?=.*[!@#$%^&*()_+|~\-={}[\]:;"'<>,.?/])(?=.*[a-zA-Z0-9À-ÿ]).{8,64}$/.test(password);}
export function checkEmailFormat(email){return /^[\w.%+-]+@[A-Za-z0-9À-ÿ.-]+\.[A-Za-zÀ-ÿ]{2,}$/.test(email);}
export function checkUsernameFormat(username){return /^[a-zA-Z0-9_À-ÿ\s]{3,20}$/.test(username);}
