const formatFilter = filter => {
    if(!filter) return {};
    for( prop in filter ){
        if(filter[prop].like){
            filter[prop] = new RegExp(`${filter[prop].like}`,'i');
        };
    };

    return filter;
};

const formatLimit = limit => {
    if(!limit) return 0;

    limit = parseInt(limit);
    if(!limit) return {error: 'Limit must be an integer'};

    return limit;
};

const formatSkip = skip => {
    if(!skip) return 0;

    skip = parseInt(skip);
    if(!skip) return {error: 'Skip must be an integer'};
    if(skip < 0) return {error: 'Skip value must be a positive integer'};

    return skip;
};

const formatQuery = query => {

    const sort = query.sort;

    const filter = formatFilter(query.filter);
    if(filter.error) return {error: filter.error};

    const limit = formatLimit(query.limit);
    if(limit.error) return {error: limit.error};

    const skip = formatSkip(query.skip)
    if(skip.error) return {error: skip.error};

    return {sort, filter, limit, skip};
};

module.exports = { formatQuery };