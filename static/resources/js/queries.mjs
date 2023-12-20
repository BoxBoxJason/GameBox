/* JavaScript FRONT
 * Project: 
 * Package:
 * Module:
 * Usage: 
 * Date: 
 * author: BoxBoxJason
 */

export function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
