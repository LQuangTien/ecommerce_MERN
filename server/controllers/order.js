const CryptoJS = require("crypto-js");
const { v1: uuid } = require("uuid");
const moment = require("moment");
const axios = require("axios").default;
const Cart = require("../models/cart");
const Order = require("../models/order");
const Address = require("../models/address");
const { ServerError, BadRequest, Create, Get } = require("../ulti/response");
exports.add = (req, res) => {
  req.body.user = req.user._id;
  req.body.process = [
    {
      type: "ordered",
      date: new Date(),
      isCompleted: true,
    },
    {
      type: "packed",
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
    Cart.findOneAndDelete({ user: req.user._id }).exec((error, cart) => {
      if (error) return ServerError(res, error);
      if (!cart) return BadRequest(res, "Cart does not exist");
      Order.populate(
        order,
        {
          path: "items",
          populate: {
            path: "productId",
            model: "Product",
            populate: {
              path: "category",
              model: "Category",
              select: "name",
            },
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
