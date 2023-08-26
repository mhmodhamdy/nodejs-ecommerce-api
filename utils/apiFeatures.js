class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    const queryStringObject = { ...this.queryString };
    const excludesFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
    excludesFields.forEach((field) => delete queryStringObject[field]);
    //filtering using [gt, gte, lt, lte]
    let queryStr = JSON.stringify(queryStringObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort('-creatAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const selectedFields = this.queryString.fields.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.select(selectedFields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select('-__v');
    }

    return this;
  }

  search(modelName) {
    if (this.queryString.keyword) {
      let query = {};
      if (modelName === 'Products') {
        query = {
          $or: [
            {
              title: { $regex: this.queryString.keyword, $options: 'i' },
            },
            {
              description: { $regex: this.queryString.keyword, $options: 'i' },
            },
          ],
        };
      } else {
        query = { name: { $regex: this.queryString.keyword, $options: 'i' } };
      }
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  paginate(countDoucuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDoucuments / limit);

    if (endIndex < countDoucuments) {
      pagination.next = page + 1;
    }

    if (skip > 0) {
      pagination.previous = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;
    return this;
  }
}

module.exports = ApiFeatures;
