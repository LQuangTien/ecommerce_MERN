const Product = require("../models/product");
const Category = require("../models/category");
const shortid = require("shortid");
const slugify = require("slugify");
const {
  ServerError,
  Create,
  Response,
  Delete,
  Get,
  NotFound,
  BadRequest,
} = require("../ulti/response");
exports.create = (req, res) => {
  const { name, price, description, category, quantity } = req.body;
  let pictures = [];
  if (req.files.length > 0) {
    pictures = req.files.map((file) => {
      return { img: file.filename };
    });
  }
  const product = new Product({
    name,
    slug: slugify(name),
    price,
    quantity,
    description,
    productPictures: pictures,
    category,
    createdBy: req.user._id,
  });
  product.save((error, product) => {
    if (error) return ServerError(res, error.message);
    if (product) return Get(res, { product });
    return NotFound(res, "Product");
  });
};
exports.getBySlug = (req, res) => {
  const { slug } = req.params;
  Category.findOne({ slug })
    .select("_id")
    .exec((error, category) => {
      if (error) return ServerError(res, error.message);
      if (!category) return NotFound(res, slug);

      Product.find({ category: category._id }).exec((error, products) => {
        if (error) return ServerError(res, error.message);
        if (products.length) return Get(res, { products });
        return NotFound(res, slug);
      });
    });
};
exports.getById = (req, res) => {
  const { id } = req.params;
  if (!id) return ServerError(res, "Params required");
  Product.findOne({ _id: id }).exec((error, product) => {
    if (error) return ServerError(res, error.message);
    if (product) return res.json({ product });
    return NotFound(res, id);
  });
};
