const CryptoJS = require("crypto-js");
const { v1: uuid } = require("uuid");
const moment = require("moment");
const axios = require("axios").default;
const Cart = require("../models/cart");
const Order = require("../models/order");
const Address = require("../models/address");
const {zaloCreateOrder} = require("../services/ZaloPay/createOrder");
const {zaloGetStatusOrderByOrderId} = require("../services/ZaloPay/getStatusOrderByOrderId");
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
exports.zaloPayment = async (req, res) => {
  // const newOrder = createOrder(req, res);
  const newOrder = await Order.findOne({_id:"619c889d06d4b51300531d89"});
  const dataZaloOrder = await zaloCreateOrder(newOrder._id.toString(),newOrder.items,newOrder.totalAmount);
  if(typeof dataZaloOrder === 'string') return ServerError(res,paymentURL);
  console.log(dataZaloOrder)
  newOrder.paymentURL = dataZaloOrder.orderurl;
  zaloGetStatusOrderByOrderId(dataZaloOrder.apptransid)
  newOrder.paymentURL = dataZaloOrder.orderurl;
  return Get({link:newOrder.paymentURL});
};

createOrder = (req, res) => {
  req.body.user = req.user._id;
  req.body.process = [
    {
      type: "progressing",
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
        });
    });
  });
};
// createOrder = (req, res) => {
//   req.body.user = req.user._id;
//   req.body.process = [
//     {
//       type: "progressing",
//       isCompleted: true,
//     },
//     {
//       type: "ordered",
//       isCompleted: false,
//     },
//     {
//       type: "shipped",
//       isCompleted: false,
//     },
//     {
//       type: "delivered",
//       isCompleted: false,
//     },
//   ];
//   const order = new Order(req.body);
//   order.save((error, order) => {
//     if (error) return ServerError(res, error);
//     if (!order) return BadRequest(res, "Order does not exist");
//     Cart.findOneAndDelete({ user: req.user._id }).exec((error, cart) => {
//       if (error) return ServerError(res, error);
//       if (!cart) return BadRequest(res, "Cart does not exist");
//       Order.populate(
//         order,
//         {
//           path: "items",
//           populate: {
//             path: "productId",
//             model: "Product",
//             populate: {
//               path: "category",
//               model: "Category",
//               select: "name",
//             },
//             select: "_id name category productPictures",
//           },
//           select: "_id status items",
//         },
//         (error, order) => {
//           if (error) return ServerError(res, error);
//           if (!order) return BadRequest(res, "Orders does not exist");
//           if (req.body.paymentOption === "cod") return Create(res, { order });
//           return order;
//         }
//       );
//     });
//   });
// };


exports.verifyZaloPayment =  (req, res) => {
  // let result = {};

  // try {
  //   let dataStr = req.body.data;
  //   let reqMac = req.body.mac;

  //   let mac = CryptoJS.HmacSHA256(dataStr, process.env.ZALO_KEY_FOR_ZALO_REQUEST).toString();
  //   console.log("mac =", mac);

  //   // kiểm tra callback hợp lệ (đến từ ZaloPay server)
  //   if (reqMac !== mac) {
  //     // callback không hợp lệ
  //     result.returncode = -1;
  //     result.returnmessage = "mac not equal";
  //   }
  //   else {
  //     // thanh toán thành công
  //     // merchant cập nhật trạng thái cho đơn hàng
  //     let dataJson = JSON.parse(dataStr, process.env.ZALO_KEY_FOR_ZALO_REQUEST);
  //     console.log("update order's status = success where apptransid =", dataJson["apptransid"]);

  //     result.returncode = 1;
  //     result.returnmessage = "success";
  //   }
  // } catch (ex) {
  //   result.returncode = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
  //   result.returnmessage = ex.message;
  // }

  // // thông báo kết quả cho ZaloPay server
  // res.json(result);

  zaloGetStatusOrderByOrderId(req.params.id)
};
exports.getOrderStatusZalo = (req, res) => {
  let data = req.query;
  let checksumData = data.appid + '|' + data.apptransid + '|' + data.pmcid + '|' + data.bankcode + '|' + data.amount + '|' + data.discountamount + '|' + data.status;
  let checksum = CryptoJS.HmacSHA256(checksumData, proccess.env.ZALO_KEY_FOR_ZALO_REQUEST).toString();

  if (checksum != data.checksum) {
    res.sendStatus(400);
  } else {
    // kiểm tra xem đã nhận được callback hay chưa, nếu chưa thì tiến hành gọi API truy vấn trạng thái thanh toán của đơn hàng để lấy kết quả cuối cùng
    res.sendStatus(200);
  }
};
// exports.getCallBackFromZalo = (req, res) => {
//   let data = req.query;
//   let checksumData = data.appid + '|' + data.apptransid + '|' + data.pmcid + '|' + data.bankcode + '|' + data.amount + '|' + data.discountamount + '|' + data.status;
//   let checksum = CryptoJS.HmacSHA256(checksumData, proccess.env.ZALO_KEY_FOR_ZALO_REQUEST).toString();

//   if (checksum != data.checksum) {
//     res.sendStatus(400);
//   } else {
//     // kiểm tra xem đã nhận được callback hay chưa, nếu chưa thì tiến hành gọi API truy vấn trạng thái thanh toán của đơn hàng để lấy kết quả cuối cùng
//     res.sendStatus(200);
//   }
// };