const axios = require('axios').default; // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js
const uuid = require('uuid').v1; // npm install uuid
const moment = require('moment'); // npm install moment

exports.createOrder = (order)
//dữ liệu dc callback cho server khi thanh toán thành công
const embeddata = {
  orderId: order._id
};

//danh sách sản phẩm
const items = order.items;

const order = {
  appid: process.env.ZALO_APPID, 
  apptransid: `${moment().format('YYMMDD')}_${uuid()}`, // mã giao dich có định dạng yyMMdd_xxxx
  appuser: "demo", 
  apptime: Date.now(), // miliseconds
  item: JSON.stringify(items), 
  embeddata: JSON.stringify(embeddata), 
  amount: 50000, 
  description: "ZaloPay Integration Demo",
  bankcode: "zalopayapp", 
};

// appid|apptransid|appuser|amount|apptime|embeddata|item
const data = order.appid + "|" + order.apptransid + "|" + order.appuser + "|" + order.amount + 
"|" + order.apptime + "|" + order.embeddata + "|" + order.item;
order.mac = CryptoJS.HmacSHA256(data, process.env.ZALO_KEY_FOR_SERVER_REQUEST).toString();

axios.post(process.env.ZALO_CREATE_ORDER_API, null, { params: order })
  .then(res => {
    return Get(res,res.data.orderurl);
  })
  .catch(err => ServerError(res,err.messages));
