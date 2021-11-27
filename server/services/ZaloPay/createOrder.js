const axios = require('axios').default; // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js
const uuid = require('uuid').v1; // npm install uuid
const moment = require('moment'); // npm install moment
const { ServerError, BadRequest, Create, Get } = require("../../ulti/response");

exports.zaloCreateOrder = (orderIdFromServer,orderItemFromServer,orderPriceFromServer) => {
  //dữ liệu dc callback cho server khi thanh toán thành công
  const embeddata = {
    merchantinfo: orderIdFromServer
  };

  //danh sách sản phẩm
  // const items = orderItemFromServer;
  const items = [{
    itemid: "knb",
    itemname: "kim nguyen bao",
    itemprice: 198400,
    itemquantity: 1
  }];
  const order = {
    appid: process.env.ZALO_APPID,
    apptransid: `${moment().format('YYMMDD')}_${uuid()}`, // mã giao dich có định dạng yyMMdd_xxxx
    appuser: "demo",
    apptime: Date.now(), // miliseconds
    item: JSON.stringify(items),
    embeddata: JSON.stringify(embeddata),
    amount:orderPriceFromServer,
    description: "ZaloPay Integration Demo",
    bankcode: "zalopayapp",
    // redirecturl: "http://localhost:8000/api/user/order/verifyZaloPayment",
    // appuser:"A",
  };



  // appid|apptransid|appuser|amount|apptime|embeddata|item
  const data = order.appid + "|" + order.apptransid + "|" + order.appuser + "|" + order.amount +
    "|" + order.apptime + "|" + order.embeddata + "|" + order.item;
  order.mac = CryptoJS.HmacSHA256(data, process.env.ZALO_KEY_FOR_SERVER_REQUEST).toString();

  return axios.post(process.env.ZALO_CREATE_ORDER_API, null, { params: order })
    .then(res => {
      // return Get(res, res.data.orderurl);
      // console.log(order.appid,order.appuser,order.apptime,order.amount,order.apptransid,order.embeddata,
      //   order.item,order.mac,order.bankcode);
      // console.log(res.data);
      res.data.apptransid = order.apptransid;
      // console.log(res.data);
      return res.data;
    })
    .catch(err => err);
}