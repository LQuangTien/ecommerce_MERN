const axios = require("axios").default; // npm install axios
const CryptoJS = require("crypto-js"); // npm install crypto-js
const qs = require("qs");
const { ServerError, BadRequest, Create, Get } = require("../../ulti/response");

exports.zaloGetStatusOrderByOrderId = async (zaloOrderId) => {
  let postData = {
    app_id: process.env.ZALO_APPID,
    app_trans_id: zaloOrderId, // Input your apptransid
  };

  let data =
    postData.app_id +
    "|" +
    postData.app_trans_id +
    "|" +
    process.env.ZALO_KEY_FOR_SERVER_REQUEST; // appid|apptransid|key1

  postData.mac = CryptoJS.HmacSHA256(
    data,
    process.env.ZALO_KEY_FOR_SERVER_REQUEST
  ).toString();
  
  let postConfig = {
    method: "post",
    url: process.env.ZALO_GET_ORDER_STATUS_API,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify(postData),
  };

  const setTimeoutPromise = (timeout) =>
    new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  console.log(postConfig, data)

  const polling = () => {
    return axios(postConfig)
      .then(function (res) {
        if (res.data.returncode === 1) {
          console.log(res.data);
          return res.data;
        } else {
          return setTimeoutPromise(20000).then(() => {
            return polling();
          });
        }
        // return Get(res,JSON.stringify(res.data));
      })
      .catch(function (error) {
        return error;
        // return ServerError(error.messages);
      });
  };

  // return await polling();
  return setTimeoutPromise(20000).then(() => {
    return polling();
  });
};
