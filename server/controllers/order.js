const CryptoJS = require("crypto-js");
const { v1: uuid } = require("uuid");
const moment = require("moment");
const axios = require("axios").default;
const Cart = require("../models/cart");
const Order = require("../models/order");
const Address = require("../models/address");
const Product = require("../models/product");
const { zaloCreateOrder } = require("../services/ZaloPay/createOrder");
const {
  zaloGetStatusOrderByOrderId,
} = require("../services/ZaloPay/getStatusOrderByOrderId");
const { ServerError, BadRequest, Create, Get } = require("../ulti/response");
exports.add = (req, res) => {
  req.body.user = req.user._id;
  req.body.process = [
    {
      type: "in progress",
      date: new Date(),
      isCompleted: true,
    },
    {
      type: "ordered",
      isCompleted: false,
    },
    {
      type: "shipped",
      isCompleted: false,
    },
    {
      type: "delivered",
      isCompleted: false,
    },
  ];
  const order = new Order(req.body);
  order.save((error, order) => {
    if (error) return ServerError(res, error);
    if (!order) return BadRequest(res, "Order does not exist");
    Cart.findOneAndDelete(
      { user: req.user._id },
      { useFindAndModify: false }
    ).exec(async (error, cart) => {
      if (error) return ServerError(res, error);
      if (!cart) return BadRequest(res, "Cart does not exist");
      const promises = [];
      req.body.items.forEach((product) => {
        const promise = Product.findByIdAndUpdate(product.productId, {
          $inc: {
            quantity: Number(product.quantity) * -1,
            quantitySold: Number(product.quantity),
          },
        });
        promises.push(promise);
      });
      await Promise.all(promises);
      Order.populate(
        order,
        {
          path: "items",
          populate: {
            path: "productId",
            model: "Product",
            select: "_id name category productPictures",
          },
          select: "_id status items",
        },
        (error, order) => {
          if (error) return ServerError(res, error);
          if (!order) return BadRequest(res, "Orders does not exist");
          return Create(res, { order });
        }
      );
    });
  });
};

exports.get = (req, res) => {
  Order.find({ user: req.user._id })
    .select("_id status items totalAmount paymentOption process createdAt")
    .populate({
      path: "items",
      populate: {
        path: "productId",
        model: "Product",
        select: "_id name category productPictures",
      },
    })
    .exec((error, orders) => {
      if (error) return ServerError(res, error);
      if (!orders) return BadRequest(res, "Orders does not exist");
      return Get(res, { orders });
    });
};
exports.getById = (req, res) => {
  const { _id } = req.params;
  Order.findOne({ _id })
    .populate("items.productId", "_id name productPictures")
    .lean()
    .exec((error, order) => {
      if (error) return ServerError(res, error);
      if (!order) return BadRequest(res, "Order does not exist");
      Address.findOne({ user: req.user._id }).exec((error, userAddress) => {
        if (error) return ServerError(res, error);
        if (!userAddress) return BadRequest(res, "User address does not exist");
        order.address = userAddress.address.find(
          (adr) => adr._id.toString() === order.addressId.toString()
        );
        return Get(res, { order });
      });
    });
};

//http://localhost:8000/api/user/order/zaloPayment
// exports.zaloPayment = async (req, res) => {
//   const newOrder = await createOrder(req.user._id, req.body);
//   const orderStatus = await zaloWorkFlow(newOrder._id.toString(), newOrder.items, newOrder.totalAmount);

//   if (typeof orderStatus === 'string') return ServerError(res, orderStatus);
//   const updatedOrder = await updateOrderStatus(newOrder._id);

//   if (typeof updatedOrder === 'string') return ServerError(res, updatedOrder);
//   return Get({ order: updatedOrder });
// };

// getOrderStatus = async (req, res) =>{

// }
// zaloWorkFlow = async (orderId, orderItem, orderTotalPrice) => {
//   const dataZaloOrder = await zaloCreateOrder(orderId, orderItem, orderTotalPrice);
//   if (typeof dataZaloOrder === 'string') return dataZaloOrder;
//   open(dataZaloOrder.orderurl);
//   const orderStatus = await zaloGetStatusOrderByOrderId(dataZaloOrder.apptransid);

//   if (orderStatus.hasOwnProperty('error')) return orderStatus.error;
//   return orderStatus.data.returncode;
// }

exports.zaloPayment = async (req, res) => {
  const newOrder = await createOrder(req.user._id, req.body);

  if (newOrder instanceof Error) return ServerError(res, newOrder);

  // console.log(newOrder)
  const dataZaloOrder = await zaloCreateOrder(
    newOrder._doc._id.toString(),
    newOrder._doc.items,
    newOrder._doc.totalAmount
  );

  if (typeof dataZaloOrder === "string") return ServerError(res, dataZaloOrder);
  return Get(res, {
    order: {
      ...newOrder,
      redirectUrl: dataZaloOrder.orderurl,
      apptransid: dataZaloOrder.apptransid,
    },
  });
};

exports.getOrderStatus = async (req, res) => {
  try {
    const orderStatus = await zaloGetStatusOrderByOrderId(req.body.apptransid);

    console.log({ main: orderStatus });
    if (orderStatus.returncode === 1) {
      const updatedOrder = await updateOrderStatusToOrdered(req.body.orderId);
      if (typeof updatedOrder === "string")
        return ServerError(res, updatedOrder);
      return Get({ order: updatedOrder });
    } else {
      return ServerError(
        res,
        orderStatus.data.returnmessage || orderStatus.error
      );
    }
  } catch (error) {
    return ServerError(res, error.messages);
  }
};

createOrder = async (userId, orderInfo) => {
  orderInfo.user = userId;
  orderInfo.process = [
    {
      type: "in progress",
      isCompleted: true,
      date: new Date(),
    },
    {
      type: "ordered",
      isCompleted: false,
    },
    {
      type: "shipped",
      isCompleted: false,
    },
    {
      type: "delivered",
      isCompleted: false,
    },
  ];

  try {
    const order = new Order(orderInfo);
    order.save();

    await Cart.findOneAndDelete({ user: userId }, { useFindAndModify: false });

    const promises = [];
    orderInfo.items.forEach((product) => {
      const promise = Product.findByIdAndUpdate(product.productId, {
        $inc: {
          quantity: Number(product.quantity) * -1,
          quantitySold: Number(product.quantity),
        },
      });
      promises.push(promise);
    });
    await Promise.all(promises);

    const newOrder = await Order.populate(order, {
      path: "items",
      populate: {
        path: "productId",
        model: "Product",
        select: "_id name category productPictures",
      },
      select: "_id status items",
    });
    return newOrder;
  } catch (error) {
    console.log(error);
    return error;
  }
};

updateOrderStatusToOrdered = async (orderId) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: orderId },
      {
        $set: {
          // process: req.body.process,
          process: [
            {
              type: "in progress",
              date: new Date(),
              isCompleted: true,
            },
            {
              type: "ordered",
              date: new Date(),
              isCompleted: true,
            },
            {
              type: "shipped",
              isCompleted: false,
            },
            {
              type: "delivered",
              isCompleted: false,
            },
          ],
        },
      },
      { new: true, useFindAndModify: false }
    ).populate("items.productId", "name productPictures");

    const orderWithAddress = await populateAddress([order]);

    return orderWithAddress;
  } catch (error) {
    return error.messages;
  }
};

const populateAddress = async (orders) => {
  let orderPromises = [];
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
  return await Promise.all(orderPromises)
    .then((response) => response)
    .catch((error) => error);
  // return newOrders;
};
