const advancedResults = (model, populate) => async (req, res, next) => {
    let query;

    const reqQuery = {...req.query}; // making a copy of an object using the spread operator "..."
    
    // Fields to exclude from query
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);



    // create query string
    let queryString = JSON.stringify(reqQuery);
    // create operators ($gt, $gte, etc)
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    //console.log(queryString);
    // finding resources
    query = model.find(JSON.parse(queryString)) // .populate will allow the virtuals to be access

    // Select Fields
    if(req.query.select){
        // This will split the SELECT fields wherever there is a comma (creates an array) and then join the array elements back together with a space
        // Note: URL query (denoted by "?") will look like this :{{URL}}/api/v1/bootcamps/?select=name,discription 
        //          where "name" and "description" are what we want to select (filter) to return
        //      Mongoose requres the fields to be separated by a space, so we use .split(",").join(" ") to replace commas with spaces
        const fields = req.query.select.split(',').join(' '); 
        query = query.select(fields);
    }

    // sort
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        // Note: putting a "-" before the sort field will reverse the 
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt') // else statement will sort by date if no other sort is specifed ("-" addition means most recent date first, oldest last)
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1; // creates page 1 as the default with page being base 10
    const limit = parseInt(req.query.limit, 10) || 25; // creates limit of 25 results by default with base 10
    const startIndex = (page-1)*limit; // calculates first result on the page based on page and limit
    const endIndex = page * limit; // calculates the last result on the page based on page and limit
    const total = await model.countDocuments(); // finds the total number of results available


    query = query.skip(startIndex).limit(limit);

    if(populate) {
        query = query.populate(populate);
    }

    // executing query
    const results = await query;

    // Pagination result - will be an empty object if a single page returns all the results
    const pagination = {};

    // if endIdex is not at the end of the total results, we will allow there to be another page next
    if(endIndex < total) {
        pagination.next = {
            page: page+1,
            limit // since variable name is same as our key name, we can do this instead of limit: limit
        }
    }

    // if startIndex is not at the begining of the results (0), we allow there to be a previous page
    if(startIndex > 0) {
        pagination.prev = {
            page: page-1,
            limit // since variable name is same as our key name, we can do this instead of limit: limit
        }
    }

    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
    };

    next();

};

module.exports = advancedResults;