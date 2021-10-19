const mongoose = require('mongoose');
const fs = require('fs/promises');
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
  Update,
  NotFound,
  BadRequest,
} = require("../ulti/response");

exports.create = async (req, res) => {
  try {
    const { name, category, regularPrice, sale, quantity, description, insurance, screen, frontCamera, rearCamera,
      chipset, screenSize, battery, soldAmount, salePrice, brand, color, ram, rom } = req.body;

    const pictures = req.files.map(file => file.filename);

    const newProduct = new Product({
      name,
      slug: slugify(name),
      category,
      regularPrice,
      sale,
      quantity,
      description,
      productPictures: pictures,
      insurance,
      screen,
      frontCamera,
      rearCamera,
      chipset,
      screenSize,
      battery,
      soldAmount,
      salePrice,
      brand,
      color,
      ram,
      rom
    });

    const savedProduct = await newProduct.save();
    return Create(res, { savedProduct });

  } catch (error) {
    return ServerError(res, error.message);
  }
};

exports.update = async (req, res) => {
  try {
    deleteOldProductImg(req.params.id);

    const pictures = req.files.map(file => file.filename);
    req.body.productPictures = pictures;

    req.body.slug = slugify(req.body.name);

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true, useFindAndModify: false }
    ).exec();

    if (updatedProduct) return Update(res, { updatedProduct });
    return NotFound(res, "Product");
  } catch (error) {
    return ServerError(res, error.message);
  }
};

exports.remove = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (deletedProduct) return Delete(res, "Product has been deleted...");
    return NotFound(res, "Product");
  } catch (error) {
    return ServerError(res, error.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) return Get(res, { product });
    return NotFound(res, "Product");
  } catch (error) {
    return ServerError(res, error.message);
  }
};

exports.getBySlug = (req, res) => {
  const { slug } = req.params;
  Category.findOne({ slug })
    .select("name")
    .exec((error, category) => {
      if (error) return ServerError(res, error.message);
      if (!category) return NotFound(res, slug);
      Product.find({ category: category.name }).exec((error, products) => {
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
  const listQuery = [];

  // POJO = plain old js object
  // let productPOJO = Product.toObject();

  for (const filter in filters) {

    //ref: https://stackoverflow.com/questions/30923378/why-does-mongoose-models-hasownproperty-return-false-when-property-does-exist
    if (Object.hasOwnProperty.call(filters, filter) && Product.schema.path(filter)) {
      const element = filters[filter];

      //Filter là giá trị trong khoảng nào đó 
      //vd: từ 10 ngàn tới 1 triệu sẽ là 10000..1000000
      if (element.indexOf(rangeFilter) !== -1) {
        const max = 99999999999999;
        const min = 0;
        const fromToRawInput = element.split(rangeFilter);

        const selectValueAndRemoveUnit = (input) => {
          // const endOfValue = item.match(/[^0-9]/) === null ? item.match(/[^0-9]/).index : -1;
          let endOfValue;

          // Tìm kí tự đầu tien ko phải là số 
          if (input.match(/[^0-9]/)) {
            endOfValue = input.match(/[^0-9]/).index;
            return input.slice(0, endOfValue)
          } else {
            return input;
          }
        };

        const fromTo = fromToRawInput.map(selectValueAndRemoveUnit);

        const from = fromTo[0] === '' ? min : parseFloat(fromTo[0]);
        const to = fromTo[1] === '' ? max : parseFloat(fromTo[1]);

        const rangeQuery = { $match: { [filter]: { $gte: from, $lte: to } } };

        listQuery.push(rangeQuery);
      } else {
        if (element.indexOf(collectionFilter) !== -1) {
          //Filter là tập hợp có nhiều giá trị 
          //vd: thuộc các category: điện thoại, tủ lạnh, máy vi tính sẽ là category:điện thoai+tủ lạnh+máy vi tính
          const collections = element.split(collectionFilter);
          const collectionQuery = { $match: { [filter]: { $in: collections } } };
          // collectionQuery = { [filter]: { $in: collections } };

          listQuery.push(collectionQuery);
        } else {
          //Filter các trường hợp riêng lẻ còn lại 
          //vd: category: điện thoại , thương hiệu: asus
          const singeQuery = { $match: { [filter]: element } };
          listQuery.push(singeQuery);
        }
      }
    } else {
      // trường hợp property không tồn tại trong product 
      return NotFound(res, "Product");
    }
  }

  try {
    const productsFilter = await Product.aggregate(listQuery).exec();
    const result = pagination(productsFilter, page, perPage);

    return Get(res, result);
  } catch (error) {
    return ServerError(res, error.messages);
  }

};

exports.search = async (req, res) => {
  try {
    let listQuery = [];

    const searchName = req.query.q;
    const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
    const searchNameRgx = rgx(searchName);

    const searchQuery = { $match: { name: { $regex: searchNameRgx, $options: "i" } } };
    listQuery.push(searchQuery);

    //"asc" là tăng dần còn "desc" là giảm dần
    if (req.query.sortBy) {
      const order = req.query.sortOrder === "asc" ? 1 : -1
      listQuery.push({ $sort: { [req.query.sortBy]: order }});
    }

    const foundProduct = await Product.aggregate(listQuery).exec();

    if (foundProduct) {
      const { page, perPage } = req.params;
      const result = pagination(foundProduct, page, perPage);
      return Get(res, result);
    }

    NotFound(res, "Product");
  } catch (error) {
    return ServerError(res, error.messages);
  }

};


function pagination(products, page = 1, perPage = 8) {
  const previousItem = (page - 1) * perPage;

  return {
    products: products.slice(previousItem, previousItem + perPage),
    totalPage: Math.ceil(products.length / perPage),
    currentPage: page,
    totalProduct: products.length
  }
};

async function deleteOldProductImg(id) {

  const oldImg = await Product.aggregate()
    .match({ "_id": mongoose.Types.ObjectId(id), })
    .project({ "_id": 0, "productPictures": 1 })
    .exec();
  // const imgBeforeUpdate = await Product.aggregate([{$match:{_id: mongoose.Types.ObjectId(req.params.id)}},
  //{$project:{productPictures: 1}}])
  // .exec();
  // oldImg.forEach(async item => await fs.unlink('/upload/' + item));

  oldImg[0].productPictures.forEach(async item => await fs.unlink('./uploads/' + item));
};
