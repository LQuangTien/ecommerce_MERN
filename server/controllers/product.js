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

exports.create = async (req, res) => {
  // const { name, price, description, category, quantity } = req.body;
  // let pictures = [];
  // if (req.files.length > 0) {
  //   pictures = req.files.map((file) => {
  //     return { img: file.filename };
  //   });
  // }
  // const product = new Product({
  //   name,
  //   slug: slugify(name),
  //   price,
  //   quantity,
  //   description,
  //   productPictures: pictures,
  //   category,
  //   createdBy: req.user._id,
  // });
  // product.save((error, product) => {
  //   if (error) return ServerError(res, error.message);
  //   if (product) return Get(res, { product });
  //   return NotFound(res, "Product");
  // });

  const { name, price, description, category, brand, color, ram, rom, quantity } = req.body;
  let pictures = [];
  if (req.files.length > 0) {
    pictures = req.files.map((file) => {
      return { img: file.filename };
    });
  }
  const newProduct = new Product({
    name,
    slug: slugify(name),
    price,
    quantity,
    description,
    productPictures: pictures,
    category,
    brand,
    color,
    ram,
    rom,
    createdBy: req.user._id,
  });

  try {
    const savedProduct = await newProduct.save();
    if (savedProduct) return Get(res, { savedProduct });
    return NotFound(res, "Product");
  } catch (err) {
    return ServerError(res, error.message);
  }
};

exports.update = async (req,res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (updatedProduct) return Get(res, { updatedProduct });
    return NotFound(res, "Product");
  } catch (err) {
    return ServerError(res, error.message);
  }
};

exports.deleteProduct= async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    if (updatedProduct) return Get(res,"Product has been deleted...");
    return NotFound(res, "Product");
  } catch (err) {
    return ServerError(res, error.message);
  }
};

exports.getById = async (req, res) => {
  // const { id } = req.params;
  // if (!id) return ServerError(res, "Params required");
  // Product.findOne({ _id: id }).populate("category", "name").exec((error, product) => {
  //   if (error) return ServerError(res, error.message);
  //   if (product) return res.json({ product });
  //   return NotFound(res, id);
  // });

  try {
    const product = await Product.findById(req.params.id);
    if (product) return Get(res, { product });
    return NotFound(res, "Product");
  } catch (err) {
    return ServerError(res, error.message);
  }
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


/***
 * ref: https://stackoverflow.com/help/searching
 */
//http://localhost:8000/api/products/filter/1/3?price=8000..10000&category=Iphone+Xiaomi
exports.getByQuery = async (req, res) => {
  const mongoose = require('mongoose');

  const { page, perPage } = req.params;
  const filters = req.query;

  const rangeFilter = '..';
  const collectionFilter = ' ';
  let listQuery = [];

  // POJO = plain old js object
  // let productPOJO = Product.toObject();

  for (const filter in filters) {

    //ref: https://stackoverflow.com/questions/30923378/why-does-mongoose-models-hasownproperty-return-false-when-property-does-exist
    if (Object.hasOwnProperty.call(filters, filter) && Product.schema.path(filter)) {
      const element = filters[filter];

      //Filter là giá trị trong khoảng nào đó 
      //vd: từ 10 ngàn tới 1 triệu sẽ là 10000..1000000
      if (element.indexOf(rangeFilter) !== -1) {
        max = 99999999999999;
        min = 0;
        from_to = element.split(rangeFilter);

        from = from_to[0] === '' ? min : parseFloat(from_to[0]);
        to = from_to[1] === '' ? max : parseFloat(from_to[1]);

        rangeQuery = { $match: { [filter]: { $gte: from, $lte: to } } };

        listQuery.push(rangeQuery);
      } else {
        if (element.indexOf(collectionFilter) !== -1) {
          //Filter là tập hợp có nhiều giá trị 
          //vd: thuộc các category: điện thoại, tủ lạnh, máy vi tính sẽ là category:điện thoai+tủ lạnh+máy vi tính
          collections = element.split(collectionFilter);
          collectionQuery = { $match: { [filter]: { $in: collections } } };
          // collectionQuery = { [filter]: { $in: collections } };

          listQuery.push(collectionQuery);
        } else {
          //Filter các trường hợp riêng lẻ còn lại 
          //vd: category: điện thoại , thương hiệu: asus
          singeQuery = { $match: { [filter]: element } };
          listQuery.push(singeQuery);
        }
      }
    } else {
      // trường hợp property không tồn tại trong product 
      return NotFound(res, filter);
    }
  }

  productsFilter = await Product.aggregate(listQuery).exec();
  const result = pagination(productsFilter, page, perPage)

  return Get(res, result);
};

function pagination(products, pageInput, itemPerPage) {
  const page = parseInt(pageInput) || 1;
  const perPage = parseInt(itemPerPage) || 8;
  const previousItem = (page - 1) * perPage;

  return {
    products: products.slice(previousItem, previousItem + perPage),
    totalPage: Math.ceil(products.length / perPage),
    currentPage: page
  }
}
