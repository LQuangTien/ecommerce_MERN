const mongoose = require("mongoose");
const fs = require("fs/promises");
const slugify = require("slugify");
const Category = require("../models/category");
const Product = require("../models/product");
const { detailedDiff } = require("deep-object-diff");
const {
  ServerError,
  Get,
  NotFound,
  Update,
  Delete,
  Create,
  BadRequest,
} = require("../ulti/response");
const product = require("../models/product");

exports.create = async (req, res) => {
  const { name, filterField, normalField } = req.body;
  const newCategory = new Category({
    name,
    slug: slugify(name),
    normalField,
    filterField,
  });

  try {
    const savedCategory = await newCategory.save();
    return Create(res, { savedCategory });
  } catch (error) {
    if (error.code === 11000) return BadRequest(res, "This category is exist");
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

exports.remove = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        $set: { isAvailable: false },
      },
      { new: true, useFindAndModify: false }
    ).exec();
    if (deletedCategory) return Delete(res, "Category has been deleted...");
    return NotFound(res, "Category");
  } catch (error) {
    return ServerError(res, error.message);
  }
};

exports.enable = async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        $set: { isAvailable: true },
      },
      { new: true, useFindAndModify: false }
    ).exec();
    if (updatedCategory) return Update(res, { updatedCategory });
    return NotFound(res, "Category");
  } catch (error) {
    return ServerError(res, error.message);
  }
};

exports.update = async (req, res) => {
  try {
    // deleteOldCategoryImg(req.params.id);
    const { name, filterField, normalField } = req.body;
    // console.log(req.body)
    const oldCategory = await Category.findById(req.params.id);

    const newCategory = {
      name,
      filterField: excludeNewInFieldCategory(filterField),
      normalField: excludeNewInFieldCategory(normalField),
    };

    updateProductBaseOnCategoryUpdate(oldCategory, newCategory);

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name,
          slug: slugify(name),
          normalField,
          filterField,
        },
      },
      { new: true, useFindAndModify: false }
    ).exec();

    if (updatedCategory) return Update(res, { updatedCategory });
    return NotFound(res, "Category");
  } catch (error) {
    return ServerError(res, error.messages);
  }
};

deleteOldCategoryImg = async (id) => {
  try {
    const oldImg = await Category.aggregate()
      .match({ _id: mongoose.Types.ObjectId(id) })
      .project({ _id: 0, categoryImage: 1 })
      .exec();
    // const imgBeforeUpdate = await Product.aggregate([{$match:{_id: mongoose.Types.ObjectId(req.params.id)}},
    //{$project:{productPictures: 1}}])
    // .exec();
    // oldImg.forEach(async item => await fs.unlink('/upload/' + item));

    oldImg.forEach(
      async (item) => await fs.unlink("./uploads/" + item.categoryImage)
    );
  } catch (error) {
    return ServerError(res, error.messages);
  }
};

//tien2@gmail.com
//123
excludeNewInFieldCategory = (fieldCategory) => {
  const removeAddedFieldCategory = fieldCategory.filter((item) => {
    if (item._id) {
      return true;
    } else {
      return false;
    }
  });
  return removeAddedFieldCategory;
};

updateProductBaseOnCategoryUpdate = async (oldCategory, newCategory) => {
  const diffInNormalField = findDiffInCategoryField(
    oldCategory.normalField,
    newCategory.normalField
  );
  const diffInFilterField = findDiffInCategoryField(
    oldCategory.filterField,
    newCategory.filterField
  );

  if (
    diffInNormalField.deleted.length > 0 &&
    diffInFilterField.deleted.length > 0
  ) {
    const removeFieldFromProduct = await Product.updateMany(
      { category: oldCategory.name },
      {
        $pull: { categoryInfo: { name: { $in: diffInNormalField.deleted } } },
        categoryInfo: { name: { $in: diffInFilterField.deleted } },
      },
      { multi: true }
    );
  } else if (diffInNormalField.deleted.length > 0) {
    const removeFieldFromProduct = await Product.updateMany(
      { category: oldCategory.name },
      { $pull: { categoryInfo: { name: { $in: diffInNormalField.deleted } } } },
      { multi: true }
    );
  } else {
    const removeFieldFromProduct = await Product.updateMany(
      { category: oldCategory.name },
      { $pull: { categoryInfo: { name: { $in: diffInFilterField.deleted } } } },
      { multi: true }
    );
  }

  if (
    diffInNormalField.updated.length > 0 ||
    diffInFilterField.updated.length > 0
  ) {
    Product.find({ category: oldCategory.name }, (err, products) => {
      products.forEach((prod) => {
        if (diffInNormalField.updated.length > 0) {
          prod.categoryInfo.forEach((field) => {
            diffInNormalField.updated.some((diff) => {
              if (diff.old === field.name) {
                field.name = diff.new;
                return true;
              }
            });
          });
        } else {
          prod.categoryInfo.forEach((field) => {
            diffInFilterField.updated.some((diff) => {
              if (diff.old === field.name) {
                field.name = diff.new;
                return true;
              }
            });
          });
        }

        prod.category = newCategory.name;
        console.log(products[0].categoryInfo);
        prod.save((err) => console.log(err));
      });
    });
  }
};

findDiffInCategoryField = (oldFieldCategory, newFieldCategory) => {
  const getIdAndNameFromOld = oldFieldCategory.map((field) => {
    let idAndName = {};
    idAndName.id = field._id;
    idAndName.name = field.name;
    return idAndName;
  });

  const getIdAndNameFromNew = newFieldCategory.map((field) => {
    let idAndName = {};
    idAndName.id = field._id;
    idAndName.name = field.name;
    return idAndName;
  });
  // const getIdAndNameFromNew = newFieldCategory.map((field) => (
  //    // let idAndName = {};
  //     {id:field._id.toString(),name:field.name}
  //    // idAndName.id = field._id.toString();
  //    // idAndName.name = field.name;
  //    // return idAndName;
  // ));
  // console.log(getIdAndNameFromOld,getIdAndNameFromNew)
  //1,2,3,4
  //5,2,3,4,6,8
  // const result = { added: [], updated: [], deleted: [] }
  // getIdAndNameFromOld.forEach((oldItem) => {
  //    const isIdExist = getIdAndNameFromNew.every((newItem) => {
  //       return oldItem.id !== newItem.id;
  //    });
  //    if (isIdExist) {
  //       if (oldItem.name !== newItem.name) {
  //          result.updated.push = newItem;
  //       }
  //    } else {
  //       result.deleted.push = oldItem;
  //    }
  // });

  // let noAddedField = 0;
  // for (let newIndex = getIdAndNameFromNew.length; newIndex >= 0; newIndex--) {
  //    const newItem = getIdAndNameFromNew[newIndex];

  //    for (let oldIndex = getIdAndNameFromOld.length; oldIndex >= 0; oldIndex--) {
  //       const oldItem = getIdAndNameFromOld[oldIndex];
  //       if (newItem.id !== oldItem.id) {
  //          result.added.push = newItem;
  //          break;
  //       } else {
  //          noAddedField = 1;
  //          break;
  //       }
  //    }

  //    if (noAddedField) break;
  // }

  // const result = {added:[],deleted:[],updated:[]};
  // let oldIndex = 0;
  // let newIndex = 0;
  // while (oldIndex < getIdAndNameFromOld.length) {
  //    const oldItem = getIdAndNameFromOld[oldIndex];
  //    const newItem = getIdAndNameFromNew[newIndex];

  //    //trường hợp cate cũ nhiều hơn cate mới do cate mới đã bị xóa field nào đó,
  //    //khi đó new sẽ duyệt hết mảng trước còn old thì vẫn còn item chưa duyệt nên phải xử lí không sẽ OutOfIndex
  //    //VD: old =[1,2,3,4,5], new=[1,2,3]
  //    if (newIndex === getIdAndNameFromNew.length - 1 && oldIndex !== getIdAndNameFromOld.length - 1) {
  //       //đẩy tất cả oldItem còn lại vào deleted vì duyệt hết new rồi mà old vẫn còn thì đây là những thằng bị xóa
  //       while (oldIndex < getIdAndNameFromOld.length) {
  //          result.deleted.push(getIdAndNameFromOld[oldIndex]);
  //          oldIndex++;
  //       }
  //       break;
  //    } //trường hợp này thì ngược vs trường hợp bên trên là cate cũ ít hơn cate mới do cate mới đã thêm field
  //    else if (newIndex !== getIdAndNameFromNew.length - 1 && oldIndex === getIdAndNameFromOld.length - 1) {
  //       // VD: old = [1,2] new = [1,2,3,4]
  //       while (newIndex < getIdAndNameFromNew.length) {
  //          newIndex++;
  //          result.added.push(getIdAndNameFromNew[newIndex]);
  //       }
  //       break;
  //    }

  //    if (oldItem.id.equals(newItem.id)) {
  //       //trường hợp giống id mà khác tên thì là updated
  //       if (oldItem.name !== newItem.name) {
  //          result.updated.push(newItem);
  //       }
  //       oldIndex++;
  //       newIndex++;
  //    } else {
  //       //trường hợp khác id thì là deleted
  //       result.deleted.push(oldItem);
  //       oldIndex++;
  //    }
  // }

  const result = { deleted: [], updated: [] };
  let oldIndex = 0;
  let newIndex = 0;
  while (oldIndex < getIdAndNameFromOld.length) {
    let oldItem = getIdAndNameFromOld[oldIndex];
    let newItem = getIdAndNameFromNew[newIndex];

    //trường hợp cate cũ nhiều hơn cate mới do cate mới đã bị xóa field nào đó,
    //khi đó new sẽ duyệt hết mảng trước còn old thì vẫn còn item chưa duyệt nên phải xử lí không sẽ OutOfIndex
    //VD: old =[1,2,3,4,5], new=[1,2,3]
    if (
      newIndex === getIdAndNameFromNew.length &&
      oldIndex < getIdAndNameFromOld.length
    ) {
      //đẩy tất cả oldItem còn lại vào deleted vì duyệt hết new rồi mà old vẫn còn thì đây là những thằng bị xóa
      while (oldIndex < getIdAndNameFromOld.length) {
        result.deleted.push(getIdAndNameFromOld[oldIndex].name);
        oldIndex++;
      }
      break;
    }
    //trường hợp này thì ngược vs trường hợp bên trên là cate cũ ít hơn cate mới do cate mới đã thêm field
    // VD: old = [1,2] new = [1,2,3,4]
    // if (oldIndex === getIdAndNameFromOld.length && newIndex < getIdAndNameFromNew.length) {
    //    while (newIndex < getIdAndNameFromNew.length) {
    //       result.added.push(getIdAndNameFromNew[newIndex]);
    //       newIndex++;
    //    }
    //    break;
    // }

    if (oldItem.id.equals(newItem.id)) {
      //trường hợp giống id mà khác tên thì là updated
      if (oldItem.name !== newItem.name) {
        result.updated.push({ old: oldItem.name, new: newItem.name });
      }
      oldIndex++;
      newIndex++;
    } else {
      //trường hợp khác id thì là deleted
      //tăng index của old lên cho tới khi tìm dc id khớp vs id hiện tại của new
      //VD: old=[1,2,3,4,5], new=[1,5]

      do {
        result.deleted.push(oldItem.name);
        if (oldIndex === getIdAndNameFromOld.length) {
          break;
        }
        oldIndex++;
        oldItem = getIdAndNameFromOld[oldIndex];
      } while (oldItem.id.equals(newItem.id) === false);
    }

    //trường hợp chạy hết index của old mà new vẫn còn thì đó là những field mới dc add vào new
    // if (oldIndex === getIdAndNameFromOld.length && newIndex < getIdAndNameFromNew.length) {
    //    // VD: old = [1,2] new = [1,2,3,4]

    //    //đẩy tất cả field còn lại của new vào add
    //    // do {
    //    //    newIndex++;
    //    //    result.added.push(getIdAndNameFromNew[newIndex]);
    //    // } while (newIndex !== getIdAndNameFromNew.length-1);
    //    while (newIndex < getIdAndNameFromNew.length) {
    //       result.added.push(getIdAndNameFromNew[newIndex]);
    //       newIndex++;
    //    }
    //    break;
    // }
  }
  return result;
};

// updateProductBaseOnCategoryUpdate = (oldCategoryName, newCategory) => {
//    Product.find({ category: oldCategoryName }).exec((err, products) => {
//       const normalFieldNames = newCategory.normalField.map((field) => { field._id, field.name });
//       const filterFieldNames = newCategory.filterField.map((field) => { field._id, field.name });

//       const updateCategoryFieldNames = [...normalFieldNames, ...filterFieldNames];

//       products.forEach((product) => {
//          let cloneCategoryInfo = [...product.categoryInfo];

//          product.categoryInfo.forEach((info) => {
//             const index = updatedCategoryNames.findIndex(
//                (name) => name === info.name
//             )

//             if (index === -1) {
//                cloneCategoryInfo = cloneCategoryInfo.filter(
//                   (inf) => inf.name !== info.name
//                )
//             }
//          });
//          product.categoryInfo = cloneCategoryInfo;
//       })
//    })
// }

// delHandler = function () {

//    // const old = [1,9,3,4,8]
//    // const news = [1,2,6,4,5]

//    const arrOld = objOld.normalField;
//    const arrNew = objNew.normalField;
//    // console.log(arrOld,arrNew)
//    const del = { normalField: [] }

//    const re = arrOld.filter((oldValue) => {
//       // find field has been deleted
//       const isObjBeDeleted = arrNew.every((newValue) => {
//          // find field has id never exist because it has been deleted
//          const idNoExist = newValue._id['$oid'] !== oldValue._id['$oid'];
//          // console.log({sameID:isSameId});
//          return idNoExist;
//       })
//       if (!isObjBeDeleted) {
//          del.normalField.push(oldValue);
//       };
//       return isObjBeDeleted;
//    })

//    console.log(re, del)

//    //   const resultDiff = detailedDiff(objOld,objNew);
//    //   // const resultDiff = detailedDiff(old,news);

//    // console.log(resultDiff)

// }
