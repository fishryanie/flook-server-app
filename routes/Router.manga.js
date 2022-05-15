const upload = require("../utils/UploadImage");
const middlewares = require('../middlewares')
const Controller = require('../controllers')

module.exports = app => {

  app.get('/api/manga-management/getMangaById/:id', Controller.manga.findMangaById)

  app.get('/api/manga-management/getManga', Controller.manga.findManga)

  app.get('/api/manga-management/getMangaByGenre', Controller.manga.findMangaByGenre)

  app.get('/api/manga-management/getMangaByAuthor', Controller.manga.findMangaByAuthor)

  app.delete('/api/manga-management/deleteMangaById/:id', Controller.manga.deleteMangaById)

  app.delete('/api/manga-management/deletedManga/:id', Controller.manga.deletedManga)

  app.post('/api/manga-management/addManga',[
    upload.single("image")
  ],Controller.manga.addManga)

  app.post('/api/manga-management/filterManga', Controller.manga.filterMany)

  app.put('/api/manga-management/updateManga/:id',[
    upload.single("image")
  ],Controller.manga.updateManga)

}