// This function validates filter string sent in te HTTP request and generates a valid filter object ready to be used by Model.filter()
const filterObject = (model, filterString) => {
    if (!filterString) return {}
    const filterArray = filterString.split(',')

    // Declaration of filter object
    const filter = {}

    // Validate filter length
    const schemaKeys = Object.keys(model.schema.paths)
    if ( filterArray.length < schemaKeys.length ){
        // Build filter
        filterArray.forEach( filterEl => {
            const [key, value] = filterEl.split(':')
            filter[key] = value
        })
        // Validate filter keys vs Schema keys
        if ( !Object.keys(filter).every( filterKey => schemaKeys.includes(filterKey)) ){
            throw {error: 'Invalid filter options.'}
        } 
    } else {
        throw {error: 'Invalid filter options.'}
    }
    return filter
}

module.exports = {
    filterObject
}