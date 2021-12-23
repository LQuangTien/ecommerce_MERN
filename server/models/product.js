// const mongoose = require("mongoose");

// const productSchema = mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     slug: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     regularPrice: {
//       type: Number,
//       required: true,
//     },
//     sale: {
//       type: String,
//       required: true,
//     },
//     salePrice: {
//       type: Number,
//       required: true,
//     },
//     quantity: {
//       type: Number,
//       required: true,
//     },
//     soldAmount: {
//       type: Number,
//       required: true,
//     },
//     description: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     // productPictures: [{ img: { type: String } }],
//     productPictures: {
//       type: Array,
//       required: true,
//     },

//     category: {
//       // type: mongoose.Schema.Types.ObjectId,
//       // ref: "Category",
//       type: String,
//       required: true,
//     },
//     insurance: {
//       type: String,
//       required: true,
//     },
//     screen: {
//       type: String,
//       required: true,
//     },
//     frontCamera: {
//       type: String,
//       required: true,
//     },
//     rearCamera: {
//       type: String,
//       required: true,
//     },
//     chipset: {
//       type: String,
//       required: true,
//     },
//     screenSize: {
//       type: String,
//       required: true,
//     },
//     battery: {
//       type: String,
//       required: true,
//     },
//     brand: {
//       type: String,
//       required: true,
//     },
//     color: {
//       type: Array,
//       required: true,
//     },
//     ram: {
//       type: Array,
//       required: true,
//     },
//     rom: {
//       type: Array,
//       required: true,
//     },

//     // createdBy: {
//     //   type: mongoose.Schema.Types.ObjectId,
//     //   ref: "User",
//     //   required: true,
//     // },
//     offer: { type: Number },
//     reviews: [
//       {
//         userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//         review: String,
//       },
//     ],
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Product", productSchema);

const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    sale: {
      type: String,
      required: true,
    },
    salePrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    quantitySold: {
      type: Number,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    productPictures: {
      type: Array,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    categoryInfo: [
      {
        name: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],
    // createdBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    //   offer: { type: Number },
    //   reviews: [
    //     {
    //       userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    //       review: String,
    //     },
    //   ],
  },
  { timestamps: true }
);

productSchema.post('save', function(error, doc, next) {
  if (error.name==='MongoError'&&error.code === 11000) {
    next(new Error('The product existed'));
  } else {
    next();
  }
});

module.exports = mongoose.model("Product", productSchema);
