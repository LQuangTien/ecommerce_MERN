const mongoose = require("mongoose");
const fs = require("fs/promises");
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
    const { name, categoryInfo, ...other } = req.body;
    const parseCate = categoryInfo.map((cate) => JSON.parse(cate));
    const pictures = req.files.map((file) => file.filename);
    const hasColor = parseCate.find((x) => x.name === "color");
    const newProduct = new Product({
      name: hasColor ? name + " " + hasColor.value : name,
      categoryInfo: parseCate,
      productPictures: pictures,
      ...other,
    });

    const savedProduct = await newProduct.save();
    return Create(res, { savedProduct });
  } catch (error) {
    return ServerError(res, error.message);
  }
};

exports.update = async (req, res) => {
  try {
    const { name, categoryInfo, ...other } = req.body;
    const parseCate = categoryInfo.map((cate) => JSON.parse(cate));
    console.log(parseCate);
    let pictures;
    const updateOption = {
      name,
      categoryInfo: parseCate,
      ...other,
    };
    if (req.files.length > 0) {
      if (req.body.productPictures) {
        deleteOldProductImg(req.params.id);
      }
      pictures = req.files.map((file) => file.filename);
      updateOption.productPictures = pictures;
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: updateOption,
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

/***
 * ref: https://stackoverflow.com/help/searching
 */
//http://localhost:8000/api/products/filter/1/3?price=8000..10000&category=Iphone+Xiaomi
exports.getByQuery = async (req, res) => {
  const { page, perPage } = req.params;
  const { q, sortBy, sortOrder, ...filters } = req.query;

  const listQuery = [];

  if (q === "all") {
    const searchQuery = {
      $match: { name: { $exists: true } },
    };
    listQuery.push(searchQuery);
  } else if (q) {
    const searchName = q;
    const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
    const searchNameRgx = rgx(searchName);

    const searchQuery = {
      $match: { name: { $regex: searchNameRgx, $options: "i" } },
    };
    listQuery.push(searchQuery);
  }

  //"asc" là tăng dần còn "desc" là giảm dần
  if (sortBy) {
    const order = sortOrder === "asc" ? 1 : -1;
    listQuery.push({ $sort: { [sortBy]: order } });
  }

  const rangeFilter = "..";
  const collectionFilter = " ";
  for (const filter in filters) {
    const element = filters[filter];

    //Filter là giá trị trong khoảng nào đó
    //vd: từ 10 ngàn tới 1 triệu sẽ là 10000..1000000
    if (element.indexOf(rangeFilter) !== -1) {
      const max = 99999999999999;
      const min = 0;
      const fromToRawInput = element.split(rangeFilter);

      const selectValueAndRemoveUnit = (input) => {
        let endOfValue = 0;

        // Tìm kí tự đầu tien ko phải là số
        if (input.match(/[^0-9]/)) {
          endOfValue = input.match(/[^0-9]/).index;
          return input.slice(0, endOfValue);
        } else {
          return input;
        }
      };

      const fromTo = fromToRawInput.map(selectValueAndRemoveUnit);

      const from = fromTo[0] === "" ? min : parseFloat(fromTo[0]);
      const to = fromTo[1] === "" ? max : parseFloat(fromTo[1]);

      //###1
      //Trường hợp filter cần xử lí ko nằm trong mảng categoryInfo thì xử lí bình thường,
      //còn filter nằm trong mảng categoryInfo thì phải sử dụng elemMatch 'categoryInfo.name' với filter
      //để tìm obj nằm trong mảng có tên khớp với filter sau đó elemMatch 'categoryInfo.value' để
      //lấy ra giá trị thực của filter
      //VD:model product như sau, ta có filter là quantity
      // {
      //   quantity: 100
      //   categoryInfo: [
      //     {
      //       name: "quantity",
      //       value: 100,
      //     }
      //   ]
      // }

      const rangeQuery = {
        $match: {
          $or: [
            { [filter]: { $gte: from, $lte: to } },
            {
              categoryInfo: {
                $elemMatch: { name: filter, value: { $gte: from, $lte: to } },
              },
            },
          ],
        },
      };

      listQuery.push(rangeQuery);
    } else {
      if (element.indexOf(collectionFilter) !== -1) {
        //Filter là tập hợp có nhiều giá trị
        //vd: thuộc các category: điện thoại, tủ lạnh, máy vi tính sẽ là category:điện thoai+tủ lạnh+máy vi tính
        const collections = element.split(collectionFilter);

        //Tương tự ý tưởng của ###1
        const collectionQuery = {
          $match: {
            $or: [
              { [filter]: { $in: collections } },
              {
                categoryInfo: {
                  $elemMatch: { name: filter, value: { $in: collections } },
                },
              },
            ],
          },
        };

        listQuery.push(collectionQuery);
      } else {
        //Filter các trường hợp riêng lẻ còn lại
        //vd: category: điện thoại , thương hiệu: asus

        //Tương tự ý tưởng của ###1
        const singeQuery = {
          $match: {
            $or: [
              { [filter]: element },
              {
                categoryInfo: {
                  $elemMatch: { name: filter, value: element },
                },
              },
            ],
          },
        };

        listQuery.push(singeQuery);
      }
    }
  }

  try {
    const productsFilter = await Product.aggregate(listQuery).exec();

    if (productsFilter) {
      const { page, perPage } = req.params;
      const result = pagination(productsFilter, page, perPage);
      return Get(res, result);
    }

    NotFound(res, "Product");
  } catch (error) {
    return ServerError(res, error.messages);
  }
};

function pagination(products, page = 1, perPage = 8) {
  const previousItem = (page - 1) * Number(perPage);

  return {
    result: {
      products: products.slice(previousItem, previousItem + Number(perPage)),
      totalPage: Math.ceil(products.length / Number(perPage)),
      currentPage: page,
      totalProduct: products.length,
    },
  };
}

async function deleteOldProductImg(id) {
  const oldImg = await Product.aggregate()
    .match({ _id: mongoose.Types.ObjectId(id) })
    .project({ _id: 0, productPictures: 1 })
    .exec();
  // const imgBeforeUpdate = await Product.aggregate([{$match:{_id: mongoose.Types.ObjectId(req.params.id)}},
  //{$project:{productPictures: 1}}])
  // .exec();
  // oldImg.forEach(async item => await fs.unlink('/upload/' + item));

  oldImg[0].productPictures.forEach(
    async (item) => await fs.unlink("./uploads/" + item)
  );
}

exports.getAll = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products) return NotFound(res, "Products");
    return Get(res, products);
  } catch (error) {
    return ServerError(res, error.messages);
  }
};
