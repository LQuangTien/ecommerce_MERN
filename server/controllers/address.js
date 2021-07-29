const Address = require("../models/address");

exports.add = (req, res) => {
  const { address } = req.body;
  Address.findOneAndUpdate(
    { user: req.user._id },
    {
      $push: {
        address,
      },
    },
    { new: true, upsert: true }
  ).exec((error, userAddress) => {
    if (error) return res.status(400).json({ error });
    if (userAddress) return res.status(201).json({ userAddress });
  });
};
exports.update = (req, res) => {
  const { address } = req.body;
  Address.findOneAndUpdate(
    { user: req.user._id, "address._id": address._id },
    {
      $set: {
        "address.$": address,
      },
    },
    { new: true }
  ).exec((error, userAddress) => {
    if (error) return res.status(400).json({ error });
    if (userAddress) return res.status(201).json({ userAddress });
  });
};
exports.get = (req, res) => {
  Address.findOne({ user: req.user._id }).exec((error, userAddress) => {
    if (error) return res.status(400).json({ error });
    if (userAddress) return res.json({ userAddress });
  });
};
