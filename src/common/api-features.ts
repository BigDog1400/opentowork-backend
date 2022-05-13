import { Aggregate } from "mongoose";
class APIFeatures {
  query: Aggregate<any>;
  queryString: Record<string | number, string | number>;

  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|eq|lte|in|lt)\b/g,
      (match) => `$${match}`
    );

    const queryObjParsed = JSON.parse(queryStr, (key, value) => {
      if (value === "true") return true;
      if (value === "false") return false;
      return value;
    });

    // we should check if any of the key in queryObjParsed has $in filter
    // if so, we should convert the string value separated by comma to array
    Object.keys(queryObjParsed).forEach((el) => {
      if (queryObjParsed[el].hasOwnProperty("$in")) {
        queryObjParsed[el]["$in"] = queryObjParsed[el]["$in"].split(",");
      }
    });

    this.query.match(queryObjParsed);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = String(this.queryString.sort).split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = {};
      String(this.queryString.fields)
        .split(",")
        .forEach((el) => (fields[el] = 1));
      this.query = this.query.project(fields);
    }
    // TODO: create a slug field in the models to be able to use this
    // else {
    //   this.query = this.query.project({ _id: 0 });
    // }
    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) * 1 || 1;
    const limit = Number(this.queryString.limit) * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.facet({
      total: [{ $count: "count" }],
      docs: [{ $skip: skip }, { $limit: limit }],
    });
    return this;
  }
}

export { APIFeatures };
