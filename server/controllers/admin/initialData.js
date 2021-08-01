const Category = require("../../models/category");
const Product = require("../../models/product");
const Order = require("../../models/order");
const Address = require("../../models/address");
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
    const [categories, products, orders] = await Promise.all([
      Category.find({}),
      Product.find({})
        .select("_id name price quantity category description productPictures")
        .populate({ path: "category", select: "_id name" }),
      Order.find({}).populate("items.productId", "name").lean(),
    ]);
    const orderWithAddress = await populateAddress(orders)
    return res.status(200).json({
      categories: populateCategory(categories),
      products,
      orders: orderWithAddress,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }
};
const populateAddress = async (orders, orderPromises = []) => {
  orders.forEach((order) => {
    const newPromise = new Promise((resolve, reject) => {
      Address.findOne({ "address._id": order.addressId })
        .populate("user", "firstName lastName email")
        .exec((error, userAddress) => {
          if (error) reject({ error });
          userAddress.address.forEach((adr) => {
            if (adr._id.toString() === order.addressId.toString()) {
              order.address = adr;
            }
          });
          resolve(order);
        });
    });
    orderPromises.push(newPromise);
  });
  const newOrders = await Promise.all(orderPromises)
    .then((response) => response)
    .catch((error) => error);
  return newOrders;
};
