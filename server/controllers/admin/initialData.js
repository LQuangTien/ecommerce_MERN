const Category = require("../../models/category");
const Product = require("../../models/product");
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
      parentId: category.parentId,
      type: category.type,
      children: populateCategory(categories, category._id),
    });
  }
  return result;
};
exports.initialData = async (req, res) => {
  try {
    const [categories, products] = await Promise.all([
      Category.find({}),
      Product.find({})
        .select("_id name price quantity category description productPictures")
        .populate({ path: "category", select: "_id name" }),
    ]);
    // const categories = await Category.find({});
    // const products = await Product.find({}).select(
    //   "_id name price quantity category description productPictures"
    // );
    return res
      .status(200)
      .json({ categories: populateCategory(categories), products });
  } catch (error) {
    return res.status(400).json({ error });
  }
};
