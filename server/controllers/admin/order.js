const Order = require("../../models/order");

exports.updateOrder = (req, res) => {
  Order.findOneAndUpdate(
    { _id: req.body._id, "process.type": req.body.type },
    {
      $set: {
        "process.$": [
          { type: req.body.type, date: new Date(), isCompleted: true },
        ],
      },
    },
    { new: true }
  ).exec((error, order) => {
    if (error) return res.status(400).json({ error });
    if (order) return res.status(201).json({ order });
  });
};
exports.getCustomerOrders = async (req, res) => {
  const orders = await Order.find({}).populate("items.productId", "name");
  return res.json({ orders });
};
