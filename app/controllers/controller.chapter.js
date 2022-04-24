const { MODEL_CHAPTERS } = require("../models");
const messages = require("../constants/Messages");
const handleError = require("../Error/HandleError");

const findChapterById = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await MODEL_CHAPTERS.findById(id).populate('book');

    // const sort1 = result[0].image;
    // console.log("sort1", sort1)

    return res.status(200).send( result )
  } catch (error) {
    handleError.ServerError(error, res);
  }
}
const findChapterByMangaId = async (req, res) => {
  const comicId = req.params.mangaId;

  const PAGE_SIZE = 10;
  let page = parseInt(req.query.page);
  const sort = req.query.sort;

  page < 0 ? (page = 1) : (page = page);
  const skip = (page - 1) * PAGE_SIZE;

  try {
    const sortChapter = sort === 'name' ? {name: 1} : null;

    const count = await MODEL_CHAPTERS.find({ book: comicId }).count();
    // console.log(count)

    const result = await MODEL_CHAPTERS.find({ book: {$eq: comicId }})
    // .populate('book')
    .skip(skip)
    .limit(PAGE_SIZE)
    .sort(sortChapter);

    // const sort1 = result[0].image;
    // console.log("sort1", sort1)

    return res.status(200).send({ data: result, count:count, message: 'Success' })
  } catch (error) {
    handleError.ServerError(error, res);
  }
}

const addChapter = async (req, res) => {
  try {
    const data = req.body;

    const result = await new MODEL_CHAPTERS({ ...data }).save();
    // console.log("result", result._id)

    if (result) {
      console.log("result")
      const update = await MODEL_CHAPTERS.updateOne(
        { name: result._id },
        { $inc: { "image.number": 1 } }
      )
      if (update) {
        return res.status(200).send({ data: result, messages: true })
      }
      return res.status(400).send({ messages: true })
    }
    return res.status(400).send({ messages: true })

  } catch (error) {
    handleError.ServerError(error)
  }
  // var currentTimeStamp = Date.parse(result[0].createAt);
  // console.log("currentTimeStamp", currentTimeStamp);
}


module.exports = {
  findChapterById,
  findChapterByMangaId,
  addChapter,
}