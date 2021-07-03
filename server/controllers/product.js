const Product = require("../models/product");
const shortid = require("shortid");
const slugify = require("slugify");
exports.create = (req, res) => {
  const {
    name,
    price,
    description,
    productPicture,
    category,
    quantity,
    createdby,
  } = req.body;
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
