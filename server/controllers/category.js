const slugify = require("slugify");
const Category = require("../models/category");
const populateCategory = (categories, parentId = null) => {
  const result = [];
  let childCategories;
  if (parentId === null) {
    childCategories = categories.filter(
      (category) => category.parentId === undefined
    );
  } else {
    childCategories = categories.filter(
      (category) => category.parentId + "" === parentId + ""
    );
  }
  for (let category of childCategories) {
    result.push({
      _id: category._id,
      name: category.name,
      slug: category.slug,
      children: populateCategory(categories, category._id),
    });
  }
  return result;
};
exports.create = (req, res) => {
  const categoryObj = {
    name: req.body.name,
    slug: slugify(req.body.name),
  };
  if (req.file) {
    categoryObj.categoryImage =
      process.env.API + "/public/" + req.file.filename;
  }
  if (req.body.parentId) {
    categoryObj.parentId = req.body.parentId;
  }

  const newCategory = new Category(categoryObj);
  newCategory.save((error, data) => {
    if (error) return res.status(400).json({ error });
    return res.status(201).json({ category: data });
  });
};

exports.get = (req, res) => {
  Category.find({}).exec((errors, data) => {
    if (errors) return res.status(400).json({ errors });
    const categories = populateCategory(data);
    return res.status(200).json({ categories });
  });
};
