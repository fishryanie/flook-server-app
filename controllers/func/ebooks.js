const handleError = require("../../error/HandleError");
const messages = require("../../constants/Messages");
const FormatDate = require('../../utils/FormatDate')
const folder = { folder: 'Flex-ticket/ImageBook' }
const cloudinary = require('../../configs/cloudnary');
const { 
  MODEL_EBOOKS, 
  MODEL_GENRES, 
  MODEL_AUTHORS, 
  MODEL_CHAPTERS_CONMIC
} = require("../../models");

const findNewDate = async (req, res, next) => {
  try {
    const booksnews = FormatDate.addArrayDays('EBOOKS_NEW')
    const result = await MODEL_EBOOKS.find({createAt: {$in: booksnews}})
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


const findNewUpdate = (req, res, next) => {

}

const findMangaById = async (req, res) => {
  const id = req.params.id;
  let manga, chapter, data;
  try {
    manga = await MODEL_EBOOKS.findById(id).populate('author');
    chapter = await MODEL_CHAPTERS_CONMIC.find({book: id});
    data = {manga, chapter}

    return res.status(200).send(data);
  } catch (error) {
    handleError.ServerError(error, res);
  }
};

const findManga = async (req, res) => {

  const deleted = req.query.deleted;
  let result;

  try {
    (deleted === "true")
      ? result = await MODEL_EBOOKS.find({ deleted: { $in: true } })
      : (deleted === "false")
        ? result = await MODEL_EBOOKS.find({ deleted: { $in: false } })
        : result = await MODEL_EBOOKS.find();
    return res.status(200).send(result);
  } catch (error) {
    handleError.ServerError(error, res);
  }
};

const findMangaByGenre = async (req, res) => {

  try {
    const genreName = req.query.genreName;
    const sort = req.query.sort;

    const genre = await MODEL_GENRES.find({ name: { $in: genreName } })
    console.log(genre)

    if (genre.length === 0) {
      console.log(messages.NotFound);
      return res.status(404).send({ messages: messages.NotFound + genreName });
    }

    const result = await MODEL_EBOOKS.find({ genre: genre })
    return res.status(200).send(result);

  } catch (error) {
    handleError.ServerError(error, res);
  }

};

const findMangaByAuthor = async (req, res) => {

  try {
    const autherName = req.query.autherName;
    const title = await MODEL_EBOOKS.find({ title: { $in: req.body.title } });
    const sort = req.query.sort;

    const auther = await MODEL_AUTHORS.find({ name: { $in: autherName } })
    console.log(auther)
    if (auther.length === 0) {
      console.log(messages.NotFound);
      return res.status(404).send({ messages: messages.NotFound + autherName });
    }

    const result = await MODEL_EBOOKS.find({ auther: auther })
    return res.status(200).send(result);

  } catch (error) {
    handleError.ServerError(error, res);
  }

};

const addManga = async (req, res) => {

  const dataBook = req.body.title;

  try {
    const title = await MODEL_EBOOKS.findOne({ title: dataBook });

    if (title) {
      console.log("tên sách tồn tại!!!");
      return res.status(400).send(title);
    }

    const imageUpload = await cloudinary.uploader.upload(req.file?.path, folder);
    const newBook = new MODEL_EBOOKS({
      ...req.body, image: { id: imageUpload.public_id, url: imageUpload.secure_url }, createAt: Date.now()
    });

    const genreBook = await MODEL_GENRES.find({ name: { $in: req.body.genre } })
    newBook.genre = genreBook?.map((genre) => genre._id);

    const auther = await MODEL_AUTHORS.find({ name: { $in: req.body.auther } })
    console.log(auther)
    if (auther.length === 0) {
      const newAuther = new MODEL_AUTHORS({
        ...req.body, book: req.body._id, name: req.body.auther
      });
      await newAuther.save();
      newBook.auther = auther?.map((auther) => auther._id);
    } else {
      newBook.auther = auther?.map((auther) => auther._id);
    }

    const result = await newBook.save();
    if (result) {
      const response = {
        data: result,
      }
      return res.status(200).send(response);
    }
  } catch (error) {
    handleError.ServerError(error, res);
  }

};



const filterMany = async (req, res) => {
  let find, sortBook, result, populate = ['authors', 'genres', 'status', 'categories']
  const PAGE_SIZE = 12;
  const numPages = parseInt(req.query.page)
  const skip = numPages ? (numPages-1) * PAGE_SIZE : null
  const { author, genre, status, allowedAge, chapter } = req.body;

  switch (req.query.sort) {
    case 'view': sortBook={view: -1}; break;
    case 'title': sortBook={title: -1}; break;
    case 'rating': break;
    default: sortBook={title: -1}; break   
  }
  if (author[0] === 'All' && genre[0] === 'All' && status[0] === 'All' && allowedAge[0] === 'All') {
    find = null
  } else {
    find = { $or: [
        { genre: { $in: genre } },
        { author: { $in: author } },
        { status: { $in: status } },
        { allowedAge: { $in: allowedAge } },
      ]
    }
  }
  try {
    const count = await MODEL_EBOOKS.find(find).count();
    if (req.query.sort && req.query.page) {
      result = await MODEL_EBOOKS.find(find).populate(populate).skip(skip).limit(PAGE_SIZE).sort(sortBook);
    } else if (req.query.page) {
      result = await MODEL_EBOOKS.find(find).populate(populate).skip(skip).limit(PAGE_SIZE);
    }
    return res.status(200).send({data: result, count: count, success:true, count: count})
  } catch (error) {
    return handleError.ServerError(error, res)
  }
}

// Filter Book test
const filterMangaTest = async (req, res) => {
  // const { status, genre, author } = req.body;
  // console.log(status, genre, author);

  // const filter = [];
  // if (status != "") filter.push({ status: status });
  // if (genre.length > 0) filter.push({ genre: { $in: genre } });
  // if (author.length > 0) filter.push({ author: { $in: author } });

  // const listBook = await MODEL_EBOOKS.find({
  //   $or: filter
  // });

  return res.status(200).send({ data: listBook });
}
const deleteMangaById = async (req, res) => {

  const id = req.params.id;
  const bookFind = await MODEL_EBOOKS.findById(id);
  let row;

  try {
    row = await MODEL_EBOOKS.findByIdAndRemove(id).exec() && await cloudinary.uploader.destroy(bookFind.image.id);
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

};

const deletedManga = async (req, res) => {

  const option = { new: true };
  const id = req.params.id;
  const bookFind = await MODEL_EBOOKS.findById(id);
  let row;

  try {

    if (bookFind.deleted === true) {
      row = await MODEL_EBOOKS.findByIdAndUpdate(id, { deleted: false, deleteAt: "", updateAt: bookFind.updateAt, createAt: bookFind.createAt }, option);
    } else {
      row = await MODEL_EBOOKS.findByIdAndUpdate(id, { deleted: true, deleteAt: FormatDate.addDays(0), updateAt: bookFind.updateAt, createAt: bookFind.createAt }, option);
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

};

const updateManga = async (req, res) => {

  const id = req.params.id;
  const image = req.body.image;
  console.log(image);
  const option = { new: true };
  let imageUpload
  try {
    const bookFind = await MODEL_EBOOKS.findById(id);
    if (req.file) {
      await cloudinary.uploader.destroy(bookFind.image.id);
      imageUpload = await cloudinary.uploader.upload(req.file?.path, folder);
    } else {
      imageUpload = await cloudinary.uploader.upload(image, folder);
      await cloudinary.uploader.destroy(bookFind.image.id);
    }

    const updateBook = new MODEL_EBOOKS({
      ...req.body, _id: id, image: { id: imageUpload?.public_id, url: imageUpload?.secure_url }, updateAt: Date.now(), createAt: bookFind.createAt, deleteAt: bookFind.deleteAt
    });

    const genreBook = await MODEL_GENRES.find({ name: { $in: req.body.genre } })
    updateBook.genre = genreBook?.map((genre) => genre._id);
    const result = await MODEL_EBOOKS.findByIdAndUpdate(id, updateBook, option);

    if (!result) {
      return handleError.NotFoundError(id, res)
    }
    return res.status(200).send({ messages: messages.UpdateSuccessfully, data: result });
  } catch (error) {
    return handleError.ServerError(error, res)
  }

}

module.exports = {
  findMangaById,
  findManga,
  findMangaByGenre,
  findMangaByAuthor,
  addManga,
  deleteMangaById,
  deletedManga,
  updateManga,
  filterMany,
  filterMangaTest


}