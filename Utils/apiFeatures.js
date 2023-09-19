class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;

    // console.log(
    //   this.query,
    //   '<--- this query ',
    //   this.queryStr,
    //   '<--- this queryStr ',
    // );
    // console.log('this runs');
  }

  filter() {
    console.log('this runs');
    const queryObj = { ...this.queryStr };
    // exclude: page, sort, limit, fields.
    const excludeFields = ['page', 'sort', 'limit', 'fields'];

    excludeFields.forEach((el) => delete queryObj[el]);

    // fetching based on the operators
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    queryStr = JSON.parse(queryStr);

    this.query = this.query.find(queryStr);
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      let sortBy = this.queryStr.sort;
      if (this.queryStr.sort.includes(','))
        sortBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    }

    return this;
  }

  fields() {
    if (this.queryStr.fields) {
      let { fields } = this.queryStr;
      if (this.queryStr.fields.includes(','))
        fields = fields.split(',').join(' ');
      this.query = this.query.select(fields);
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    if (this.queryStr.page || this.queryStr.limit) {
      const page = this.queryStr.page * 1 || 1;
      const limit = this.queryStr.limit * 1 || 10;
      const skip = (page - 1) * limit;

      this.query = this.query.skip(skip).limit(limit);
    }
    return this;
  }
}

module.exports = APIFeatures;
