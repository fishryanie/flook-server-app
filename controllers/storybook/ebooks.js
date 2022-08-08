const cloudinary = require('../../configs/cloudnary');
const handleError = require("../../error/HandleError");
const messages = require("../../constants/messages");
const folder = { folder: 'Flex-ticket/ImageBook' }
const models = require("../../models");
const { addDays, addArrayDays } = require('../../functions/globalFunc');



module.exports = {

  findOneEbook: async (req, res) => {
    const populate = ['authors', 'genres']

    try {
      const id = req.query.id;
      const result = await models.ebooks.findById(id).populate(populate);
      result && res.status(200).send({success: true, data: result, message: messages.FindSuccessfully});
    } catch (error) {
      return handleError.ServerError(error, res);
    }
  },

  findManyEbook: async (req, res) => {
      const deleted = req.query.deleted;
      const populate = ['authors', 'genres']
      let result;
      try {
        (deleted === "true")
          ? result = await models.ebooks.find({ deleted: { $in: true } }).populate(populate)
          : (deleted === "false")
            ? result = await models.ebooks.find({ deleted: { $in: false } }).populate(populate)
            : result = await models.ebooks.find().populate(populate);
        return res.status(200).send({data: result, success: true, message: messages.FindSuccessfully});
      } catch (error) {
        handleError.ServerError(error, res);
      }
    },

  insertOneEbook: async (req, res) => {
    const dataBook = req.body.title;
    console.log('title', dataBook);
    const itemTrash = req.body.authors.pop() && req.body.genres.pop();
    console.log('itemTrash', itemTrash);
    try {
      const title = await models.ebooks.findOne({ title: dataBook });
  
      if (title) {
        console.log("tên sách tồn tại!!!");
        return res.status(400).send(title);
      }
  
      const imageUpload = await cloudinary.uploader.upload(req.file?.path, folder);
      const newBook = new models.ebooks({
        ...req.body, images: { background: { id: imageUpload.public_id, url: imageUpload.secure_url }, wallPaper: { id: imageUpload.public_id, url: imageUpload.secure_url } }, createAt: addDays(0)
      });
  
      const result = await newBook.save();
      if (result) {
        const response = {
          data: result,
          message: messages.InsertSuccessfully,
          success: true
        }
        return res.status(200).send(response);
      }
    } catch (error) {
      handleError.ServerError(error, res);
    }
  },

  insertManyEbook: async (req, res) => {

  },

  updateOneEbook: async (req, res) => {
    const id = req.query.id;
    const itemTrash = req.body.genres.pop() && req.body.authors.pop();
    const image = req.body.images;
    console.log('body', req.body);
    const option = { new: true };
    let imageUpload
    try {
      const bookFind = await models.ebooks.findById(id);
      if (req.file) {
        await cloudinary.uploader.destroy(bookFind.images.background.id);
        imageUpload = await cloudinary.uploader.upload(req.file?.path, folder);
      } else {
        imageUpload = await cloudinary.uploader.upload(image, folder);
        await cloudinary.uploader.destroy(bookFind.images.background.id);
      }
  
      const updateBook = new models.ebooks({
        ...req.body, images: { background: { id: imageUpload.public_id, url: imageUpload.secure_url }, wallPaper: { id: imageUpload.public_id, url: imageUpload.secure_url } }, updateAt: Date.now(), createAt: bookFind.createAt, deleteAt: bookFind.deleteAt
      });
  
      const result = await models.ebooks.findByIdAndUpdate(id, updateBook, option);
  
      if (!result) {
        return handleError.NotFoundError(id, res)
      }
      return res.status(200).send({ message: messages.UpdateSuccessfully, data: result });
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  },

  deleteOneEbook: async (req, res) => {
    const id = req.params.id;
    const bookFind = await models.ebooks.findById(id);
    let row;
  
    try {
      row = await models.ebooks.findByIdAndDelete(id).exec() && await cloudinary.uploader.destroy(bookFind.image.id);
      console.log(row);
      if (!row) {
        console.log(messages.NotFound);
        return res.status(404).send({ messages: messages.NotFound + id });
      }
      console.log(messages.DeleteSuccessfully);
      return res.status(200).send({ messages: messages.DeleteSuccessfully });
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  },

  deleteManyEbook: async (req, res) => {

  },

  removeOneEbook: async (req, res) => {
    const option = { new: true };
    const id = req.query.id;
    const bookFind = await models.ebooks.findById(id);
    let row;
  
    try {
  
      if (bookFind.deleted === true) {
        row = await models.ebooks.findByIdAndUpdate(id, { deleted: false, deleteAt: "", updateAt: bookFind.updateAt, createAt: bookFind.createAt }, option);
      } else {
        row = await models.ebooks.findByIdAndUpdate(id, { deleted: true, deleteAt: addDays(0), updateAt: bookFind.updateAt, createAt: bookFind.createAt }, option);
      }
      console.log(row);
      if (!row) {
        console.log(messages.NotFound);
        return res.status(404).send({ message: messages.NotFound + id });
      }
      console.log(messages.DeleteSuccessfully);
      return res.status(200).send({ message: messages.DeleteSuccessfully });
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  },

  removeManyEbook: async (req, res) => {
    const listDelete = req.body;
    const option = { new: true };
    try {
      const result = await models.ebooks.updateMany(
        { "_id": { $in: listDelete } }, 
        { $set: { deleted: true, deleteAt: Date.now() } },
        option
      );
      if(!result){
        return res.status(400).send({ success: false,message: messages.RemoveNotSuccessfully});
      }
      const response = {
        success: true,
        message: messages.RemoveSuccessfully,
      };
      return res.status(200).send(response);
    } catch (error) {
      handleError.ServerError(error, res);
    }
  },

  searchEbook: async (req, res) =>{
    const showEbook = { title:1, images:1, authors:1, genres:1, status:1, description:1, allowedAge:1, views:1 };
    try {
      let alowAgeCondition, chapterCondition
      const { author, genre, status, allowedAge, newDay, chapter } = req.body;
      const { sort, page, orderby } = req.query;
      const pageSize = 12, skip = page ? (parseInt(page) - 1) * pageSize : null
      const select = [
        {$match: {deleted: false, $and: [
          genre ? { genres: { $in: genre } } : {},
          author ? { authors: { $in: author } } : {},
          status ? { status: status[0]} : {},
          chapter ? { chapter: chapterCondition } : {},
          allowedAge ? { allowedAge: alowAgeCondition } : {},
          newDay ? {createAt: { $in: addArrayDays('EBOOKS_NEW') }} : {}
        ]}},
        {$lookup: {from: 'authors',localField: 'authors',foreignField: '_id',as: 'authors', pipeline: [{$match: {deleted: false}},{$project: {name: 1, images: '$images.avatar.url'}}]}},
        {$lookup: {from: 'genres',localField: 'genres',foreignField: '_id',as: 'genres', pipeline: [{$match: {deleted: false}},{$project: {name: 1}}]}},
        {$lookup: {from: 'reviews',localField: '_id',foreignField: 'ebooks',as: 'reviews',pipeline: [{$match: {deleted: false}}]}},
        {$lookup: {from: 'chapters',localField: '_id',foreignField: 'ebooks',as: 'chapters', pipeline: [{$match: {deleted: false}}]}},
        {$lookup: {from: 'users',localField: '_id',foreignField: 'subscribe.ebooks',as: 'subscribers',pipeline: [{$match: {deleted: false}}]}},
        {$lookup: {from: 'users',localField: '_id',foreignField: 'history.read.ebooks',as: "readers",pipeline: [{$match: {deleted: false}}]}},
        {$lookup: {from: 'comments',localField: 'reviews._id',foreignField: 'reviewId',as: 'commentsReview',pipeline: [{$match: {deleted: false}}]}},
        {$lookup: {from: 'comments',localField: 'chapters._id',foreignField: 'chapterId',as: 'commentsChapter',pipeline: [{$match: {deleted: false}}]}},
        {$project: {...showEbook,
          sumHot: { $sum: [
            {$size: '$reviews'},
            {$size: '$reviews.likes'}, 
            {$size: '$chapters.likes'}, 
            {$size: '$commentsReview'}, 
            {$size: '$commentsChapter'}, 
            {$size: '$commentsReview.likes'}, 
            {$size: '$commentsChapter.likes'}
          ]},
          avgScore:{'$divide': [{'$trunc':{'$add':[{'$multiply': [{$avg:'$reviews.rating' }, 100]}, 0.5]}}, 100]},
          subscribers: {$size: { "$setUnion": [ "$subscribers._id", [] ]}},
          sumPage: {$size: { '$setUnion': [ '$chapters._id', [] ]}}, 
          readers: {$sum: {$size: '$readers'}},
        }},
      ]
      if(allowedAge) {
        switch (allowedAge) {
          case 11: alowAgeCondition = { $lte: 11 }; break;
          case 18: alowAgeCondition = { $lte: 18, $gte:12 }; break;
          case 30: alowAgeCondition = { $lte: 30, $gte:18 }; break;
          case 31: alowAgeCondition = { $gte: 31 }; break;
          default: break;
        }
      }
      if(chapter) {
        switch (chapter) {
          case '0-50': chapterCondition = { $lte: 50 }; break;
          case '50-200': chapterCondition = { $lte: 200, $gte: 50 }; break;
          case '200-500': chapterCondition = { $lte: 500, $gte: 200 }; break;
          case 'more500': chapterCondition = { $gte: 500}; break;
          default: break;
        }
      }
      if(sort) {
        switch (sort) {
          case 'hot':
            select.push({$sort:{sumHot: parseInt(orderby) || -1}})
            break;
          case 'name':
            select.push({$sort:{title: parseInt(orderby) || -1}})
            break;
          case 'view':
            select.push({$sort:{view: parseInt(orderby)|| -1}})
            break;
          case 'score':
            select.push({$sort:{avgScore: parseInt(orderby) || -1}})
            break;
          case 'reader':
            select.push({$sort:{readers: parseInt(orderby)|| -1}})
            break;
          case 'subscribers':
            select.push({$sort:{subscribers: parseInt(orderby) || -1}})
            break;
          default: break;
        }
      } 
      page && select.push({$skip: skip },{$limit: pageSize })
      const result = await models.ebooks.aggregate(select)
      result && res.send({success: true, length: result.length, data: result})
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  },


  findManyByUser: async (req, res) => {
    try {
      let userId = req.userIsLogged._id
      const { type, page } = req.query;
      switch (type) {
        case 'readed':{
          const result = await models.users.findOne({_id: userId, deleted: false}, {'history.read.ebooks': 1}).populate('history.read.ebooks')
          result && res.status(200).send({success: true, count: result.history.read.ebooks.length, data: result.history.read.ebooks})
          break;
        }
        case 'download': {
          const result = await models.users.findOne({_id: userId, deleted: false}, {'history.download.ebooks': 1}).populate('history.download.ebooks')
          result && res.status(200).send({success: true, count: result.history.download.ebooks.length, data: result.history.download.ebooks})
          break;
        }
        case 'subscribe': {
          const result = await models.users.findOne({_id: userId, deleted: false}, {'subscribe.ebooks': 1}).populate('subscribe.ebooks')
          result && res.status(200).send({success: true, count: result.subscribe.ebookslength, data: result.subscribe.ebooks})
          break;
        }
        default: break;
      }
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  },
}



const findNewDate = async (req, res, next) => {
  try {
    const booksnews = addArrayDays('EBOOKS_NEW')
    const result = await models.ebooks.find({createAt: {$in: booksnews}})
    if( result && result.length > 0 ) {
      return res.status(200).send({data: result, success: true})
    } else if (result.length <= 0) {
      return res.status(200).send({data: result, success: false, error: {message: 'No data'}})
    } else if (!result) {
      return res.status(400).send({data: result, success: false, error: {message: 'Can not found data'}})
    }
  } catch (error) {
    handleError.ServerError(error, res)
  }
}








// const findMangaByGenre = async (req, res) => {

//   try {
//     const genreName = req.query.genreName;
//     const sort = req.query.sort;

//     const genre = await models.genres.find({ name: { $in: genreName } })
//     console.log(genre)

//     if (genre.length === 0) {
//       console.log(messages.NotFound);
//       return res.status(404).send({ messages: messages.NotFound + genreName });
//     }

//     const result = await models.ebooks.find({ genre: genre })
//     return res.status(200).send(result);

//   } catch (error) {
//     handleError.ServerError(error, res);
//   }

// };

// const findMangaByAuthor = async (req, res) => {

//   try {
//     const autherName = req.query.autherName;
//     const title = await models.ebooks.find({ title: { $in: req.body.title } });
//     const sort = req.query.sort;

//     const auther = await models.authors.find({ name: { $in: autherName } })

//     if (auther.length === 0) {
//       console.log(messages.NotFound);
//       return res.status(404).send({ messages: messages.NotFound + autherName });
//     }

//     const result = await models.ebooks.find({ auther: auther })
//     return res.status(200).send(result);

//   } catch (error) {
//     handleError.ServerError(error, res);
//   }

// };






