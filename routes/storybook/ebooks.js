const upload = require("../../functions/UploadImage");
const middlewares = require('../../middlewares')
const Controller = require('../../controllers')

module.exports = app => {

  app.get('/api/ebooks-management/fineOneManga', Controller.ebooks.findMangaById)



  app.get('/api/manga-management/getMangaByGenre', Controller.ebooks.findMangaByGenre)

  app.get('/api/manga-management/getMangaByAuthor', Controller.ebooks.findMangaByAuthor)

  app.delete('/api/manga-management/deleteMangaById/:id', Controller.ebooks.deleteMangaById)

  app.delete('/api/manga-management/deletedManga/:id', Controller.ebooks.deletedManga)

  app.post('/api/manga-management/addManga',[
    upload.single("image")
  ],Controller.ebooks.addManga)

  app.post('/api/ebook-management/filter-ebooks', Controller.ebooks.filterEbooks)

  app.put('/api/manga-management/updateManga/:id',[
    upload.single("image")
  ],Controller.ebooks.updateManga)

}