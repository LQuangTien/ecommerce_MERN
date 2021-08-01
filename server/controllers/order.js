const Cart = require("../models/cart");
const Order = require("../models/order");
const Address = require("../models/address");
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
    if (error) return res.status(400).json({ error });
    Cart.findOneAndDelete({ user: req.user._id }).exec((error, cart) => {
      if (error) return res.status(400).json({ error });

      if (order)
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
          (err, order) => {
            return res.status(201).json({ order });
          }
        );
    });
  });
};

exports.get = (req, res) => {
  Order.find({ user: req.user._id })
    .select("_id status items")
    .populate({
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
    })
    .exec((error, orders) => {
      if (error) return res.status(400).json({ error });
      if (orders) return res.json({ orders });
    });
};
exports.getById = (req, res) => {
  const { _id } = req.params;
  Order.findOne({ _id })
    .populate("items.poductId", "_id name productPictures")
    .lean()
    .exec((error, order) => {
      if (error) return res.status(400).json({ error });
      if (order) {
        Address.findOne({ user: req.user._id }).exec((error, userAddress) => {
          if (error) return res.status(400).json({ error });
          order.address = userAddress.address.find(
            (adr) => adr._id.toString() === order.addressId.toString()
          );
          return res.json({ order });
        });
      }
    });
};

// .populate("items.productId", "_id name category productPictures")
// .populate("category", "name")
