const middlewares = require("../../middlewares");
const Controller = require('../../controllers');
const apiString = require('../../constants/api');
const { subStr } = require("../../functions/globalFunc");

module.exports = app => { 
    app.get(apiString.payment, middlewares.auth.accessPermission(subStr(apiString.payment)), Controller.payment.payment);
    
    app.get(apiString.paySuccess,  Controller.payment.paySuccess);
    
    app.get(apiString.payCancel, Controller.payment.payCancel);
}