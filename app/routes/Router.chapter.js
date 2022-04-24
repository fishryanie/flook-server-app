const upload = require("../utils/UploadImage");
const middlewares = require('../middlewares')
const Controller = require('../controllers')

module.exports = app => {

  app.get('/api/chapter-management/getChapterById/:id',
    Controller.chapter.findChapterById)

  app.post('/api/chapter-management/getChapterByMangaId/:mangaId',
    Controller.chapter.findChapterByMangaId)
  app.post('/api/chapter-management/addChapter',
    Controller.chapter.addChapter)

}