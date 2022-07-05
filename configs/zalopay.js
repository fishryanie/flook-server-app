// Node v10.15.3
const axios = require('axios').default; // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js
const moment = require('moment');

const config = {
  appid: "553",
  key1: "9phuAOYhan4urywHTh0ndEXiV3pKHr5Q",
  key2: "Iyz2habzyr7AG8SgvoBCbKwKi3UzlLi3",
  endpoint: "https://sbgateway.zalopay.vn/api/getlistmerchantbanks"
};

let reqtime = Date.now();

const mac = CryptoJS.HmacSHA256(config.appid + "|" + reqtime, config.key1).toString()

const items = [{
  itemid: "knb",
  itemname: "kim nguyen bao",
  itemprice: 198400,
  itemquantity: 1
}];


const zalopay = {
  genTransID() {
    return `${moment().format('YYMMDD')}_${config.appid}_${++reqtime}`;
  },
  
  findListBank: async (req, res) => {
    try {
      const params = { appid: config.appid, reqtime: reqtime, mac: mac };
      const result = await axios.get(config.endpoint, { params })
      return res.status(200).send(result.data.banks)
    } catch (error) {
      console.error(error)
    }
  },


}

module.exports = zalopay