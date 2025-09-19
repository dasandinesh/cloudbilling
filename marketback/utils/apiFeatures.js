// class APIFeatures {
//   constructor(query, queryStr) {
//     // Corrected the typo
//     this.query = query;
//     this.queryStr = queryStr; // Corrected the typo
//   }

//   search() {
//     let keyword = this.queryStr.keyword
//       ? {
//           name: {
//             $regex: this.queryStr.keyword,
//             $options: "i", // 'i' for case-insensitive search
//           },
//         }
//       : {};

//     this.query.find({ ...keyword }); // Assign the query result to this.query
//     return this;
//   }

//   filter() {
//     const queryStrcopy = { ...this.queryStr };
//     const removeFields = ["search", "keyword", "limit", "page"];
//     removeFields.forEach((field) => delete queryStrcopy[field]);
//     this.query.find(queryStrcopy);
//     return this;
//   }

//   paginate() {
//     const page = this.queryStr.page * 1 || 1; // Convert to number, default to 1
//     const limit = this.queryStr.limit * 5 || 5; // Convert to number, default to 10
//     const skip = (page - 1) * limit; // Calculate number of documents to skip

//     this.query = this.query.limit(limit).skip(skip); // Apply limit and skip to the query
//     return this;
//   }
// }

// module.exports = APIFeatures;

class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keywordConditions = [];

    // Add name search condition if keyword exists
    if (this.queryStr.keyword) {
      keywordConditions.push({
        name: {
          $regex: this.queryStr.keyword,
          $options: "i",
        },
      });
    }

    // Add admission number search condition if searchAdmissionNo exists
    if (this.queryStr.admission_no) {
      keywordConditions.push({
        admission_no: {
          $regex: this.queryStr.admission_no,
          $options: "i",
        },
      });
    }

    // Combine conditions with OR logic
    if (keywordConditions.length > 0) {
      this.query = this.query.find({
        $or: keywordConditions,
      });
    }

    return this;
  }

  filter() {
    const queryStrcopy = { ...this.queryStr };
    // Remove special fields that shouldn't be used for exact filtering
    const removeFields = ["keyword", "admission_no", "limit", "page"];
    removeFields.forEach((field) => delete queryStrcopy[field]);

    this.query = this.query.find(queryStrcopy);
    return this;
  }

  paginate() {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.limit(limit).skip(skip);
    return this;
  }
}

module.exports = APIFeatures;
