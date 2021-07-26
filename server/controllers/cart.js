const Cart = require("../models/cart");
const runUpdate = (condition, update) => {
  return new Promise((resolve, reject) => {
    Cart.findOneAndUpdate(condition, update, { upsert: true })
      .then(() => resolve())
      .catch((err) => reject(err));
  });
};
exports.addItem = (req, res) => {
  Cart.findOne({ user: req.user._id }).exec((error, cart) => {
    if (error) return res.status(400).json({ error });
    if (cart) {
      let promises = [];
      req.body.cartItems.forEach((cartItem) => {
        const product = cartItem.product;
        const item = cart.cartItems.find((c) => c.product == product);
        let condition, update;
        if (item) {
          condition = {
            user: req.user._id,
            "cartItems.product": product,
          };
          update = {
            $set: {
              "cartItems.$": cartItem,
            },
          };
        } else {
          condition = { user: req.user._id };
          update = { $push: { cartItems: cartItem } };
        }
        promises.push(runUpdate(condition, update));
      });
      Promise.all(promises)
        .then((response) => res.status(201).json({ response }))
        .catch((error) => res.status(400).json({ error }));
    } else {
      const newCart = new Cart({
        user: req.user._id,
        cartItems: req.body.cartItems,
      });
      newCart.save((error, cart) => {
        if (error) return res.status(400).json({ error });
        return res.status(200).json({ cart });
      });
    }
  });
};
exports.getCart = (req, res) => {
  Cart.findOne({ user: req.user._id })
    .populate("cartItems.product", "_id name price productPictures")
    .exec((error, cart) => {
      if (error) return res.status(400).json({ error });
      if (cart) {
        let cartItems = {};
        cart.cartItems.forEach((item, index) => {
          const { product, quantity } = item;
          const { _id, name, price, productPictures } = product;
          cartItems[_id.toString()] = {
            _id,
            name,
            price,
            quantity,
            img: productPictures[0].img,
          };
        });
        return res.json({ cartItems });
      }
    });
};
