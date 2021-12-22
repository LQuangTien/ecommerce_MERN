const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
    },
    categoryImage: { type: String },
    normalField: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        // type: {
        //   type: String,
        //   enum: ['single', 'multiply'],
        //   required: true,
        //   trim: true,
        // },
        // valueType: {
        //   type: String,
        //   enum: ["text", "number"],
        //   required: true,
        //   trim: true,
        // },
      },
    ],
    filterField: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        value: {
          type: Array,
          required: true,
          trim: true,
        },
        // type: {
        //   type: String,
        //   enum: ["single", "multiply"],
        //   required: true,
        //   trim: true,
        // },
        // valueType: {
        //   type: String,
        //   enum: ["string", "number"],
        //   required: true,
        //   trim: true,
        // },
      },
    ],
  },
  { timestamps: true }
);

// categorySchema.pre('save',(next)=>{
//   const category = this;

//   category.normalField=JSON.parse(category.normalField);
//   category.filterField=JSON.parse(category.filterField);

//   next();
// });

module.exports = mongoose.model("Category", categorySchema);
