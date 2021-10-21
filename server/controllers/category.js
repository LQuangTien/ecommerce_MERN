// const slugify = require("slugify");
// const Category = require("../models/category");
// const populateCategory = (categories, parentId = null) => {
//   const result = [];
//   let childCategories;
//   if (parentId === null) {
//     childCategories = categories.filter(
//       (category) => category.parentId === undefined
//     );
//   } else {
//     childCategories = categories.filter(
//       (category) => category.parentId + "" === parentId + ""
//     );
//   }
//   for (let category of childCategories) {
//     result.push({
//       _id: category._id,
//       name: category.name,
//       slug: category.slug,
//       parentId: category.parentId,
//       type: category.type,
//       children: populateCategory(categories, category._id),
//     });
//   }
//   return result;
// };
// exports.create = (req, res) => {
//   const categoryObj = {
//     name: req.body.name,
//     slug: slugify(req.body.name),
//   };
//   if (req.file) {
//     categoryObj.categoryImage =
//       process.env.API + "/public/" + req.file.filename;
//   }
//   if (req.body.parentId) {
//     categoryObj.parentId = req.body.parentId;
//   }

//   const newCategory = new Category(categoryObj);
//   newCategory.save((error, data) => {
//     if (error) return res.status(400).json({ error });
//     return res.status(201).json({ category: data });
//   });
// };

// exports.get = (req, res) => {
//   Category.find({}).exec((errors, data) => {
//     if (errors) return res.status(400).json({ errors });
//     const categories = populateCategory(data);
//     return res.status(200).json({ categories });
//   });
// };

// exports.update = async (req, res) => {
//   const { _id, name, parentId, type } = req.body;
//   const updatedCategories = [];
//   if (name instanceof Array) {
//     for (let i = 0; i < name.length; i++) {
//       const category = {
//         name: name[i],
//         type: type[i],
//       };
//       if (parentId[i] !== "") {
//         category.parentId = parentId[i];
//       }
//       const updatedCategory = await Category.findOneAndUpdate(
//         { _id: _id[i] },
//         category,
//         { new: true }
//       );
//       updatedCategories.push(updatedCategory);
//     }
//     return res.status(201).json({ updatedCategories });
//   } else {
//     const category = {
//       name: name,
//       type: type,
//     };
//     if (parentId !== "") {
//       category.parentId = parentId;
//     }
//     const updatedCategory = await Category.findOneAndUpdate({ _id }, category, {
//       new: true,
//     });
//     return res.status(201).json({ updatedCategory });
//   }
// };

// exports.remove = (req, res) => {
//   const { ids } = req.body;
//   const deletedCategories = ids.map(async (_id) => {
//     const deletedCategory = await Category.findOneAndDelete({ _id });
//     return deletedCategory;
//   });
//   return res.status(200).json({ deletedCategories });
// };

const mongoose = require('mongoose');
const fs = require('fs/promises');
const slugify = require("slugify");
const Category = require("../models/category");
const { ServerError, Get, NotFound, Update, Delete } = require("../ulti/response");

exports.create = async (req, res) => {
  const { name, filterField, normalField } = JSON.parse(req.body.categoryData);

  const newCategory = new Category({
    name,
    slug: slugify(name),
    categoryImage: req.file.filename,
    normalField,
    filterField
  });

  try {
    const savedCategory = await newCategory.save();
    return Create(res, { savedCategory });
  } catch (error) {
    return ServerError(res, error.message);
  }
};
exports.getAll = async (req, res) => {
  try {
    const foundCategory = await Category.find();
    if (foundCategory) return Get(res, { foundCategory });
    return NotFound(res, "Category");
  } catch (error) {
    return ServerError(res, error.messages);
  }
};
exports.get = async (req, res) => {
  try {
    const foundCategory = await Category.findById(req.params.id);
    if (foundCategory) return Get(res, { foundCategory });
    return NotFound(res, "Category");
  } catch (error) {
    return ServerError(res, error.messages);
  }
};

exports.update = async (req, res) => {
  try {
    deleteOldCategoryImg(req.params.id);

    const { name, filterField, normalField } = JSON.parse(req.body.categoryData);

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name,
          slug: slugify(name),
          categoryImage: req.file.filename,
          normalField,
          filterField
        },
      },
      { new: true, useFindAndModify: false })
      .exec();

      if (updatedCategory) return Update(res, { updatedCategory });
      return NotFound(res, "Category");
  } catch (error) {
    return ServerError(res, error.messages);
  }
};

exports.remove = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (deletedCategory) return Delete(res, "Category has been deleted...");
    return NotFound(res, "Category");
  } catch (error) {
    return ServerError(res, error.messages);
  }
};

deleteOldCategoryImg = async (id) => {
  try {
    const oldImg = await Category.aggregate()
      .match({ "_id": mongoose.Types.ObjectId(id), })
      .project({ "_id": 0, "categoryImage": 1 })
      .exec();
    // const imgBeforeUpdate = await Product.aggregate([{$match:{_id: mongoose.Types.ObjectId(req.params.id)}},
    //{$project:{productPictures: 1}}])
    // .exec();
    // oldImg.forEach(async item => await fs.unlink('/upload/' + item));

    oldImg.forEach(async item => await fs.unlink('./uploads/' + item.categoryImage));
  } catch (error) {
    return ServerError(res, error.messages);
  }
};