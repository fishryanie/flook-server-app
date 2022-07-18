const models = require('../models')
const cloudinary = require('../configs/cloudnary')
const handleError = require('../error/HandleError')
const jwt = require("jsonwebtoken");
const configsToken = require('../configs/token');
const dataDefault = require('../functions/dataDefault');
const zalopay = require('../configs/zalopay');
const { addDays, randomDate, addArrayDays } = require('../functions/globalFunc');
const showEbook = {title:1, images:1, authors:1, genres:1, status:1, description:1, allowedAge:1, views:1}

module.exports = app => {

  require('./auth/role')(app)
  require('./auth/user')(app)
  require('./auth/feature')(app)
  require('./auth/featureGroup')(app)
  require('./movie/cast')(app)
  require('./movie/movie')(app)
  require('./review/review')(app)
  require('./review/comment')(app)
  require('./storybook/ebooks')(app)
  require('./storybook/genre')(app)
  require('./storybook/author')(app)
  require('./storybook/chapter')(app)

  app.get('/layout/web-hook', (req, res) => {})

  
  app.get('/layout/form-change-password', (req, res) => {
    const token = req.query.token
    if (!token) {
      return handleError.NoTokenError(res)
    }else {
      jwt.verify(token, configsToken.secret, async (err, decoded) => {
        // should return if token error
        if (err) {
          res.render()
          // return handleError.TokenError(err, res)
        }
        else {
          res.render()
        }
      })
    }
  })

  app.get('/api/zalopay/findManyBank', zalopay.findListBank)


  app.get('/api/data-management/create-default-data', async (req, res) => {
    const token = req.query.token
    if (!token) {
      return handleError.NoTokenError(res)
    }else {
      jwt.verify(token, configsToken.secret, async (err, decoded) => {
        // should return if token error
        if (err) return handleError.TokenError(err, res)
        // Find user is logged
        const userIsLogged = await models.users.findById(decoded.id).populate('roles')
        // Shold returns if no logged in user is found
        if (!userIsLogged) return handleError.NotFoundError(decoded.id, res)
        
        userIsLogged.roles.forEach(role => {
          if( role.name === 'Moderator') {
            dataDefault()
            return res.send({success: true, messages: 'create default data'})
          }
        });
      })
    }
  })

  app.delete('/api/cloudinary-management/delete-one-image', async (req, res) => {
    try {
      const response = await cloudinary.uploader.destroy(req.query.id);
      response.result === 'ok' && res.send({message: 'delete successfully'});
      response.result === 'not found' && handleError.NotFoundError(req.query.id, res)
    } catch (error) {
      handleError.ServerError(error, res)
    }
  })

  app.get('/api/statistical/new-members', async (req, res) => {
    try {
      let find
      switch (req.query.time) {
        case 'day': find =  {$where : `return this.createAt.getDate() == ${addDays(0).getDate().toString().length === 1 ? '0' + addDays(0).getDate() : addDays(0).getDate()} && this.createAt.getFullYear() == ${addDays(0).getFullYear()}`}; break;
        case 'month': find = {$where : `return (this.createAt.getMonth() == ${addDays(0).getMonth().toString().length === 1 ? '0' + addDays(0).getMonth() : addDays(0).getMonth()}) && (this.createAt.getFullYear() == ${addDays(0).getFullYear()})`}; break;
        case 'yeah': find =  {$where : `return this.createAt.getFullYear() == ${addDays(0).getFullYear()}`}; break;
        default: break;
      }      
      const result = await models.users.find(find).sort({createAt: -1})
      result && res.status(200).send({success: true, data:result})
    } catch (error) {
      handleError.ServerError(error, res)
    }
  })

  app.get('/api/statistical/author-rankings-by-subscribers', async (req, res) => {
    try {
      const select = [
        {$match: {deleted: false}},
        {$lookup: {from: 'authors',localField: '_id',foreignField: 'subscribe.ebooks',as: 'subscribers',pipeline: [{$match: {deleted: false}}]}},
        {$project: {...showEbook, subscribers: {$size: { '$setUnion': [ '$subscribers._id', [] ]}}}},
        {$sort: { subscribers: -1 }}
      ]
      const result = await models.ebooks.aggregate(select)
      result && res.status(200).send({count: result.length, data: result, success: true})
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  })

  app.get('/api/statistical/ebooks-rankings-by-views', async (req, res) => {
    try {
      const result = await models.ebooks.find({delete: false}).sort({views: -1})
      result && res.status(200).send({success: true, data: result})
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  })

  app.get('/api/statistical/ebooks-rankings-by-review-score', async (req, res) => {
    try {
      const select = [
        {$match: {deleted: false}},
        {$lookup: {from: 'reviews',localField: '_id',foreignField: 'ebooks',as: 'countSum',pipeline: [{$match: {deleted: false}}]}},
        {$project:{...showEbook, countSum: { $avg: '$countSum.rating' }}}, // làm sao hiện tất cả field ngoài cách này
        {$sort: { countSum: -1 }}
      ]
      const result = await models.ebooks.aggregate(select)
      result && res.status(200).send({count: result.length, data: result, success: true})
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  })
  
  app.get('/api/statistical/ebooks-rankings-by-reader', async (req, res) => {
    try {
      const select = [
        {$match: {deleted: false}},
        {$lookup: {from: 'users',localField: '_id',foreignField: 'history.read.ebooks',as: "readers",pipeline: [{$match: {deleted: false}}]}},
        {$project: {...showEbook, readers: {$size: { '$setUnion': [ '$readers._id', [] ]}}}},
        {$sort: { readers: -1 }}
      ]
      const result = await models.ebooks.aggregate(select)
      result && res.status(200).send({count: result.length, data: result, success: true})
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  })


  app.get('/api/statistical/ebooks-rankings-by-subscribers', async (req, res) => {
    try {
      const select = [
        {$match: {deleted: false}},
        {$lookup: {from: "users",localField: "_id",foreignField: "subscribe.ebooks",as: "subscribers",pipeline: [{$match: {deleted: false}}]}},
        {$project: {...showEbook, subscribers: {$size: { "$setUnion": [ "$subscribers._id", [] ]}}}},
        {$sort: { subscribers: -1 }}
      ]
      const result = await models.ebooks.aggregate(select)
      result && res.status(200).send({count: result.length, data: result, success: true})
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  })
}