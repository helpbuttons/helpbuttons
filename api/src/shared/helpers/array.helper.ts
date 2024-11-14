
export const unique = (array, id = null)=> 
{
    const _ = require('lodash')
    if(!id)
    {
        return _.uniq(array)    
    }
    return _.uniqBy(array, id)
}