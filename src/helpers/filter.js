// This function validates filter string sent in te HTTP request and generates a valid filter object ready to be used by Model.find()
const filterObject = (model, filterString) => {
    if (!filterString) return {}
    
    try {
        const filter = JSON.parse(filterString)
    } catch {
        throw {error: 'The provided filter has an invalid format.'}
    }

    const schemaKeys = Object.keys(model.schema.paths)

    // Validate filter keys number
    if ( Object.keys(filter).length > schemaKeys.length ) throw {error: 'Invalid filter keys.'}

    // Validate that all the filters are included into the schema keys
    if ( !Object.keys(filter).every( el => schemaKeys.includes(el))) throw new Error({error: 'Invalid filter keys.'})
    
    // Transform the JSON input to a valid filter
    Object.entries(filter).forEach( ([key, value]) => {
        if (value.match(/\/*\//i)) {
            filter[key] = eval(value)
        } else if (value.startsWith('$gte:')){
            filter[key] = {$gte: value.replace('$gte:','')}
        } else if (value.startsWith('$gt:')){
            filter[key] = {$gt: value.replace('$gt:','')}
        } else if (value.startsWith('$lt:')){
            filter[key] = {$lt: value.replace('$lt:','')}
        } else if (value.startsWith('$lte:')){
            filter[key] = {$lte: value.replace('$lte:','')}
        }
    })

    return filter
}

module.exports = {
    filterObject
}