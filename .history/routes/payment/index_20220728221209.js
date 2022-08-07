const middlewares = require("../../middlewares");
const Controller = require('../../controllers');
const apiString = require('../../constants/api');
const { subStr } = require("../../functions/globalFunc");

module.exports = app => { 
    app.get(apiString.payment, middlewares.auth.accessPermission(subStr(apiString.findOneComment)) , Controller.comment.findOneComment);
    
    app.get(apiString.findManyComment, middlewares.auth.accessPermission(subStr(apiString.findManyComment)) , Controller.comment.findManyComment);
    
    app.get(apiString.searchComment, middlewares.auth.accessPermission(subStr(apiString.searchComment)) , Controller.comment.searchComment);
}