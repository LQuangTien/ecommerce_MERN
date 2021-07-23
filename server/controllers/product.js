const Product = require("../models/product");
const Category = require("../models/category");
const shortid = require("shortid");
const slugify = require("slugify");
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
    if (error) return res.status(400).json({ error });
    return res.status(200).json({ product });
  });
};
exports.getBySlug = (req, res) => {
  const { slug } = req.params;
  Category.findOne({ slug })
    .select("_id")
    .exec((error, category) => {
      if (error) return res.status(400).json({ error });
      if (category) {
        Product.find({ category: category._id }).exec((error, products) => {
          if (error) return res.status(400).json({ error });
          if (products.length > 0)
            return res.status(200).json({
              products,
              groupByPrice: {
                under5k: products.filter((p) => p.price <= 5000),
                under10k: products.filter(
                  (p) => p.price > 5000 && p.price <= 10000
                ),
                under15k: products.filter(
                  (p) => p.price > 10000 && p.price <= 15000
                ),
                under20k: products.filter(
                  (p) => p.price > 15000 && p.price <= 20000
                ),
                under30k: products.filter(
                  (p) => p.price > 20000 && p.price <= 30000
                ),
              },
            });
        });
      }
    });
};
exports.getById = (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Params required" });
  Product.findOne({ _id: id }).exec((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) return res.json({ product });
  });
};
