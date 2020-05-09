const formatFilter = filter => {
    if(!filter) return {};
    for( prop in filter ){
        if(filter[prop].like){
            filter[prop] = new RegExp(`${filter[prop].like}`,'i');
        };
    };

    return filter;
};

const formatQuery = query => {

    const sort = query.sort;

    const filter = formatFilter(query.filter);
    if(filter.error) return {error: filter.error};

    return {sort, filter};
};

module.exports = { formatQuery };