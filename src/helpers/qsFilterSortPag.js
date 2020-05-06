
const buildFilter = filter => {

    for ( property in filter ){

        const regexp = filter[property].regexp;
        const options = filter[property].options;
        
        if(regexp && options){
            filter[property] = new RegExp(regexp, options);
        };
    };

    return filter;
};

// Must be performed a check for each sorted field in the sort object
const checkSort = sort => {
    for( property in sort ){
        const sortValue = sort[property];
        if( sortValue !== 1 && sortValue !== -1){
            return {error: `Invalid sort value for field "${property}", must be 1 or -1`} 
        };
    };
    return sort;
};

const formatFilterSortPag = query => {

    let sort, filter, limit, skip;

    try {
        if(query.sort){
            sort = JSON.parse(query.sort);
            sort = checkSort(sort);
            if(sort.error) return {error: sort.error};
        } else {
            sort = {};
        }
    } catch {
        return { error: 'Error parsing "sort" to JSON' };
    };

    try {
        filter = query.filter ? JSON.parse(query.filter) : {};
        filter = buildFilter(filter);
    } catch {
        return { error: 'Error parsing "filter" to JSON' };
    };

    try {
        limit = query.limit ? parseInt(query.limit) : '';
    } catch {
        return { error: 'Error parsing "limit" to integer' };
    };

    try {
        skip = query.skip ? parseInt(query.skip) : '';
    } catch {
        return { error: 'Error parsing "skip" to integer' };
    };

    return {sort, filter, skip, limit};
};

module.exports = { formatFilterSortPag }