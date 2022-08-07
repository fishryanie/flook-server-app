const middlewares = require("../../middlewares");
const Controller = require('../../controllers');
const apiString = require('../../constants/api');
const { subStr } = require("../../functions/globalFunc");

module.exports = app => { 
    app.get(apiString.payment, middlewares.auth.accessPermission(subStr(apiString.payment)) , Controller.comment.findOneComment);
    
    app.get(apiString.paySuccess,  Controller.comment.findManyComment);
    
    app.get(apiString.payCancel, Controller.comment.searchComment);
}