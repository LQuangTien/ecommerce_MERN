const axios = require('axios').default; // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js
const qs = require('qs')

exports.GetStatusOrderByOrderId = (zaloOrderId)=>{
    let postData = {
        appid: process.env.ZALO_APPID,
        apptransid: zaloOrderId, // Input your apptransid
    }
    
    let data = postData.appid + "|" + postData.apptransid + "|" + process.env.ZALO_KEY_FOR_SERVER_REQUEST; // appid|apptransid|key1
    postData.mac = CryptoJS.HmacSHA256(data, process.env.ZALO_KEY_FOR_SERVER_REQUEST).toString();
    
    
    let postConfig = {
        method: 'post',
        url: process.env.ZALO_GET_ORDER_STATUS_API,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(postData)
    };
    
    axios(postConfig)
        .then(function (response) {
            return Get(res,JSON.stringify(response.data));
        })
        .catch(function (error) {
            return ServerError(res,error.messages);
        });
};

