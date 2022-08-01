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
        ...req.body, images: { background: { id: imageUpload.public_id, url: imageUpload.secure_url }, wallPaper: { id: imageUpload.public_id, url: imageUpload.secure_url } }, createAt: Date.now()
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
  
      // const genreBook = await models.genres.find({ name: { $in: req.body.genre } })
      // updateBook.genre = genreBook?.map((genre) => genre._id);
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
    const PAGE_SIZE = 12;
    const numPages = parseInt(req.query.page)
    const skip = numPages ? (numPages-1) * PAGE_SIZE : null
    const { authors, genres, status, allowedAge, chapters } = req.body;
    let find, sortBook, result=[], populate = ['authors', 'genres']

    switch (req.query.sort) {
      case 'view': sortBook={view: -1}; break;
      case 'title': sortBook={title: -1}; break;
      case 'rating': break;
      default: break;
    }

    if(authors === undefined){
      console.log('a');

      find = null
    } else if (authors?.length >= 0 && authors[0]==='All' && genres[0]==='All' && status[0]==='All' && allowedAge[0]==='All') {
      find = null
    } else {
      find = { $or: [
          { genres: { $in: genres } },
          { authors: { $in: authors } },
          { status: { $in: status } },
          { allowedAge: { $in: allowedAge } },
        ]
      }
    }
    try {
      const count = await models.ebooks.find(find).count();
      if (req.query.sort > 0 && req.query.page > 0) {
        result = await models.ebooks.find(find).populate(populate).skip(skip).limit(PAGE_SIZE).sort(sortBook);
      }
      if (req.query.sort == 0) {
        result = await models.ebooks.find(find).populate(populate).skip(skip).limit(PAGE_SIZE);
      }
      result.length > 0 && res.status(200).send({data: result, count: count, success:true, message: messages.FindSuccessfully})
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  }
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






