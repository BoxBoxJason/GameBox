/* Node.js BACKEND
 * Project: GameBox
 * Package: api
 * Module: utils
 * Usage: Utility module for API queries.
 * Date: 20/12/2023
 * author: BoxBoxJason
 */

/**
 * Returns the parameters of a query in a dict format. Filters unauthorized arguments.
 * @param {Request} query - 
 * @param {Array<string>} allowed_params_list - List of allowed parameters to request
 * @param {boolean} all_if_empty - States if query params should return all allowed params if empty
 * @returns {Object<string,any>} - Query argument: Query value (null if empty)
 */
export function getQueryParams(query,allowed_params_list,all_if_empty=true) {
    const query_params = {};
    if (Object.keys(query).length === 0 && all_if_empty) {
        allowed_params_list.forEach(key => {
            query_params[key] = null;
        });
    } else {
        Object.keys(query).forEach(key => {
            if (allowed_params_list.includes(key)) {
                query_params[key] = query[key];
            }
        });
    }
    
    return query_params;
}
