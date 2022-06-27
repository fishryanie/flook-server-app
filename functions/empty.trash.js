const { MODEL_MANGAS } = require('../models')
const cloudinary = require('./configs.cloudnary')
const FormatDate = require('./FormatDate')

const emptyTrash = async () =>{

  const dayDeleted = FormatDate.addDays(0);
  const bookFind = await MODEL_MANGAS.find({deleted: { $eq: true}});
  
bookFind.forEach(async (item, index, arr) => { 
  arr[index].deleteAt?.setDate(arr[index].deleteAt?.getDate() + 30);
  const id = (arr[index]._id).toString();

  if(arr[index].deleteAt <= dayDeleted){
    await cloudinary.uploader.destroy(arr[index].image.id) 
    && await MODEL_MANGAS.findByIdAndRemove(id).exec();
  }
  });
}

module.exports = {
  emptyTrash,
}