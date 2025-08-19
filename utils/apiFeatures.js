class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    filter() {

        const queryStringObj = { ...this.queryString };
        const excludesFields = [ // this is important and must be kept in sync with the frontend
                                // any changes here must be reflected in the frontend // bad error
            'page',
            'sort',
            'limit',
            'fields',
            'keyword',
            'search',
            'order',
            'populate',
            'select'
        ];
        excludesFields.forEach((field) => delete queryStringObj[field]);
        // Apply filtration using [gte, gt, lte, lt]
        let queryStr = JSON.stringify(queryStringObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        // Manual conversion of query params to filter object
        const filterObj = {};
        Object.keys(queryStringObj).forEach(key => {
            // Check for operators in the value, e.g. price[lte]=45
            if (typeof queryStringObj[key] === 'object') {
                filterObj[key] = {};
                Object.keys(queryStringObj[key]).forEach(op => {
                    filterObj[key][`$${op}`] = queryStringObj[key][op];
                });
            } else if (key.includes('[') && key.includes(']')) {
                // For query like price[lte]=45
                const field = key.split('[')[0];
                const op = key.split('[')[1].replace(']', '');
                if (!filterObj[field]) filterObj[field] = {};
                filterObj[field][`$${op}`] = queryStringObj[key];
            } else {
                filterObj[key] = queryStringObj[key];
            }
        });

        this.mongooseQuery = this.mongooseQuery.find(filterObj);
        return this;
    }

    sort() {// done
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        } else {
            this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
        }
        return this;
    }

    limitFields() {//done
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.select(fields);
        } else {
            this.mongooseQuery = this.mongooseQuery.select('-__v');
        }
        return this;
    }

    search(modelName) {
        if (this.queryString.keyword) {
            let query = {};
            if (modelName === 'Products') {
                query.$or = [
                    { title: { $regex: this.queryString.keyword, $options: 'i' } },
                    { description: { $regex: this.queryString.keyword, $options: 'i' } },
                ];
            } else {
                query = { name: { $regex: this.queryString.keyword, $options: 'i' } };
            }
            this.mongooseQuery = this.mongooseQuery.find(query);
        }
        return this;
    }

    paginate(countDocuments) {//done
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 20;
        const skip = (page - 1) * limit;
        const endIndex = page * limit;


        // Pagination result
        const pagination = {};
        pagination.currentPage = page;
        pagination.limit = limit;
        pagination.numberOfPages = Math.ceil(countDocuments / limit);

        // next page
        if (endIndex < countDocuments) {
            pagination.next = page + 1;
        }
        if (skip > 0) {
            pagination.prev = page - 1;
        }
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

        this.paginationResult = pagination;
        return this;
    }
}

module.exports = ApiFeatures;
