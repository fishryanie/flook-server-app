const cloudinary = require('../../configs/cloudnary');
const handleError = require("../../error/HandleError");
const messages = require("../../constants/messages");
const folder = { folder: 'Flex-ticket/ImageBook' }
const models = require("../../models");
const { addDays, addArrayDays } = require('../../functions/globalFunc');



module.exports = {

  findOneEbook: async (req, res) => {
    try {
      const id = req.query.id;
      const result = await models.ebooks.findById(id)
      result && res.status(200).send({success: true, data: result});
    } catch (error) {
      return handleError.ServerError(error, res);
    }
  },

  findManyEbook: async (req, res) => {
    const findManga = async (req, res) => {
      const deleted = req.query.deleted;
      let result;
      try {
        (deleted === "true")
          ? result = await models.ebooks.find({ deleted: { $in: true } })
          : (deleted === "false")
            ? result = await models.ebooks.find({ deleted: { $in: false } })
            : result = await models.ebooks.find();
        return res.status(200).send(result);
      } catch (error) {
        handleError.ServerError(error, res);
      }
    };
  },

  insertOneEbook: async (req, res) => {

  },

  insertOneEbook: async (req, res) => {
    const dataUser = req.body.username;
    console.log('roles', req.body.roles)
    try {
      const userName = await models.users.findOne({username: dataUser})
      if(userName){
        return res.status(400).send(userName);
      }
      const avatarUpload = await cloudinary.uploader.upload(req.file?.path, folder);
      const USER = new models.users({...req.body, images: { avatar: { id: avatarUpload.public_id, url: avatarUpload.secure_url }} });
      USER.roles = req.body.roles.pop()
      const result = await USER.save();
      if(result){
        const response = {
          data: result,
          status: 200,
          message: messages.InsertSuccessfully,
        }
        return res.status(200).send(response)
      }
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  },

  insertManyEbook: async (req, res) => {

  },

  updateOneEbook: async (req, res) => {
    const id = req.params.id;
    const image = req.body.image;
    console.log(image);
    const option = { new: true };
    let imageUpload
    try {
      const bookFind = await models.ebooks.findById(id);
      if (req.file) {
        await cloudinary.uploader.destroy(bookFind.image.id);
        imageUpload = await cloudinary.uploader.upload(req.file?.path, folder);
      } else {
        imageUpload = await cloudinary.uploader.upload(image, folder);
        await cloudinary.uploader.destroy(bookFind.image.id);
      }
  
      const updateBook = new models.ebooks({
        ...req.body, _id: id, image: { id: imageUpload?.public_id, url: imageUpload?.secure_url }, updateAt: Date.now(), createAt: bookFind.createAt, deleteAt: bookFind.deleteAt
      });
  
      const genreBook = await models.genres.find({ name: { $in: req.body.genre } })
      updateBook.genre = genreBook?.map((genre) => genre._id);
      const result = await models.ebooks.findByIdAndUpdate(id, updateBook, option);
  
      if (!result) {
        return handleError.NotFoundError(id, res)
      }
      return res.status(200).send({ messages: messages.UpdateSuccessfully, data: result });
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
    const id = req.params.id;
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
        return res.status(404).send({ messages: messages.NotFound + id });
      }
      console.log(messages.DeleteSuccessfully);
      return res.status(200).send({ messages: messages.DeleteSuccessfully });
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
    console.log("filter ebook");
   
      
      try {
    
        const PAGE_SIZE =10;
        const numPages = parseInt(req.query.page)
        const skip = numPages ? (numPages - 1) * PAGE_SIZE : null
        const { author, genre, status, allowedAge, sort , newDay} = req.body;
        console.log("🚀 ~ file: ebooks.js ~ line 187 ~ searchEbook: ~ status", status[0])
      
        let find, populate = ['authors', 'genres']
    
        let alowAgeCondition, sortCondition
    
        if (allowedAge.length > 0) {
          // console.log("allowedAge[0].allowed", allowedAge[0])
          switch (allowedAge[0]) {
            case 11: alowAgeCondition = { $lte: 11 }
              break;
            case 18: alowAgeCondition = { $lte: 18  ,$gte:12 }
              break;
            case 30: alowAgeCondition = { $lte: 30 ,  $gte: 18 }
              break;
            case 31: alowAgeCondition = { $gte: 31 }
              break;
            default: alowAgeCondition = null
              break;
          }
        }
        if (sort.length > 0) {
       
          switch (sort[0].name) {
    
            case "Sort by name":
              if (sort[0].type === "ASC") {
                sortCondition = { title: 1 }
              } else sortCondition = { title: -1 }
              break;
            case "Sort by view":
              if (sort[0].type === "ASC") {
                sortCondition = { view: 1 }
              } else sortCondition = { view: -1 }
              break;
            case "Sort by date":
              if (sort[0].type === "ASC") {
                sortCondition = { createAt: 1 }
              } else sortCondition = { createAt: -1 }
              break;
    
            default: sortCondition = null
              break;
          }
        }
    
        if (author.length === 0 && genre.length === 0 && allowedAge.length === 0 && status.length === 0  && !newDay) {
          find = {"deleted":false}
        } else {
          console.log("co dieu kien")
          find = {
              deleted:false,
              $and: [
                genre.length > 0 ? { genres: { $in: genre } } : {} ,
                author.length > 0 ? { authors: { $in: author } } :{},
                status.length >  0 ? { status: status[0]}: {},
                allowedAge.length > 0 ? { allowedAge: alowAgeCondition }:{},
                newDay ? {createAt: addArrayDays('EBOOKS_NEW')} :{}
              ]   
          }
        }
    
        const count = await models.ebooks.find(find).count();
    
        if (sort.length > 0 && req.query.page > 0) {
    console.log("Vào đây ");
          result = await models.ebooks.find(find).populate(populate).skip(skip).limit(PAGE_SIZE).sort(sortCondition);
          
        }
        else if (sort.length === 0) {
          result = await models.ebooks.find(find).populate(populate).skip(skip).limit(PAGE_SIZE);
        }
    
       return res.status(200).send({data: result, count: count , success: true, message: messages.GetDataSuccessfully})
    
    
      } catch (error) {
        return handleError.ServerError(error, res)
      }
    
  },


  findManyByUser: async (req, res) => {
    try {
      let result, userId = req.userIsLoggedId._id
      switch (req.query.type) {
        case 'readed':
    
          result = await models.users.findOne({_id: userId, deleted: false}, {'history.read.ebooks': 1}).populate('history.read.ebooks')
          break;
        case 'subscribe':
          result = await models.users.findOne({_id: userId, deleted: false}, {'subscribe.ebooks': 1}).populate('subscribe.ebooks')
          break;
        default: break;
      }
      result && res.status(200).send({
        success: true, 
        count: result?.subscribe?.ebooks?.length ? result?.subscribe?.ebooks?.length : result.history?.read?.ebooks?.length, 
        data: result?.subscribe?.ebooks ? result?.subscribe?.ebooks : result?.history?.read?.ebooks})
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  },

  changePassword: async (req, res) => {
    const userId = req.userIsLogged._id.toString();
    const passwordNew = req.body.password_New
    
    try {
      const result = await models.users.findOneAndUpdate(
        { _id: userId },
        { password: await models.users.hashPassword(passwordNew) },
        { new: true, upsert: true }
      );
      if (!result) {
        return res.status(400).send({ message: "Update that bai" });
      }
      return res.status(200).send({data: result, success: true, message: 'Change Password Successfully!!!'});
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






