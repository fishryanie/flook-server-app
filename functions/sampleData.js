'use strict';
const models = require('../models')
const FormatDate = require('./FormatDate');
const dataDefaults = {
  users: require('../jsons/user.json'),
  roles: require('../jsons/roles.json'),
  ebooks: require('../jsons/ebooks.json'),
  status: require('../jsons/status.json'),
  genres: require('../jsons/genres.json'),
  authors: require('../jsons/author.json'),
  categories: require('../jsons/categories.json'),
}

const InsertedSuccess = collectionString => `Inserted ${collectionString} Success`
const InsertedFailure = collectionString => `Inserted ${collectionString} Failure`
const UpdatedSuccess = collectionString => `Updated ${collectionString} Success`
const UpdatedFailure = collectionString => `Updated ${collectionString} Failure`
const DeletedSuccess = collectionString => `Deleted ${collectionString} Success`
const DeletedFailure = collectionString => `Deleted ${collectionString} Failure`


async function edit_date_ebooks () {
  let tam = -1, result=[]
  const count = await models.ebooks.count()
  const EBOOKS = await models.ebooks.aggregate([{ $sample: { size: count/4 } }])
  const booksnews = FormatDate.addArrayDays('EBOOKS_NEW')
  if(count > 0 && EBOOKS.length > 0) {
    for (let doc of EBOOKS) {
      tam ++
      if(tam > booksnews.length) {
        tam = 0
      }
      await models.ebooks.updateOne({_id: doc._id}, { createAt: booksnews[tam] });
    }
  }
  console.log(result ? UpdatedSuccess('EBOOKS') : UpdatedFailure('EBOOKS'))
}

const SampleData = () => {
  Promise.all([
    models.users.deleteMany(),
    models.roles.deleteMany(),
    models.ebooks.deleteMany(),
    models.genres.deleteMany(),
    models.authors.deleteMany(),
    models.categories.deleteMany(),
    models.chapterchats.deleteMany(),
    models.chaptercomics.deleteMany(),
    models.chapternovels.deleteMany(),
    models.reviews.deleteMany(),
    models.comments.deleteMany(),
    models.status.deleteMany(),
  ]).then(result => {
    Promise.all([...result,
      models.roles.insertMany(dataDefaults.roles),
      models.genres.insertMany(dataDefaults.genres),
      models.authors.insertMany(dataDefaults.authors),
      models.categories.insertMany(dataDefaults.categories),
      models.status.insertMany(dataDefaults.status)
    ]).then(result => {
      const ROLES = result[12], GENRES = result[13], AUTHORS = result[14], CATEGORIES = result[15], STATUS = result[16];

      // INSERT USER
      if(result[0] && ROLES.length > 0){
        // MAP ROLES FOR USER
        for (let iu in dataDefaults.users) {
          for (let ir in ROLES) {
            if(dataDefaults.users[iu].roles === ROLES[ir].name) {
              dataDefaults.users[iu].roles = ROLES[ir]._id
            }
          } 
        }
      }
      // INSERT EBOOKS
      if(result[2] && GENRES.length > 0 && AUTHORS.length > 0 && CATEGORIES.length > 0 && STATUS.length > 0){
        for (let ib in dataDefaults.ebooks) {
          // MAP CATEGORIES FOR STATUS
          for (let is in STATUS) {
            if(dataDefaults.ebooks[ib].statusId === STATUS[is].name){
              dataDefaults.ebooks[ib].statusId = STATUS[is]._id
            }
          }
          // MAP CATEGORIES FOR EBOOKS
          for (let ic in CATEGORIES) {
            if(dataDefaults.ebooks[ib].categorysId === CATEGORIES[ic].name){
              dataDefaults.ebooks[ib].categorysId = CATEGORIES[ic]._id
            }
          }
          // MAP GENRES FOR EBOOKS
          for (let ig in GENRES) {
            for (let ibg in dataDefaults.ebooks[ib].genresId) {
              if(dataDefaults.ebooks[ib].genresId[ibg] === GENRES[ig].name){
                dataDefaults.ebooks[ib].genresId[ibg] = GENRES[ig]._id
              }
            }
          } 
          // MAP GENRES FOR AUTHOR
          for (let ia in AUTHORS) {
            for (let iba in dataDefaults.ebooks[ib].authorsId) {
              if(dataDefaults.ebooks[ib].authorsId[iba] === AUTHORS[ia].name){
                dataDefaults.ebooks[ib].authorsId[iba] = AUTHORS[ia]._id
              }
            }
          }
        }
      }
      // console.log(dataDefaults.ebooks)
      Promise.all([
        models.users.insertMany(dataDefaults.users),
        models.ebooks.insertMany(dataDefaults.ebooks)
      ]).then((result) => {
        console.log(result[0].length > 0 ? InsertedSuccess('USER') : InsertedFailure('USER'));
        console.log(result[1].length > 0 ? InsertedSuccess('EBOOKS') : InsertedFailure('EBOOKS'));
        edit_date_ebooks()
      })

      console.log(result[0] ? DeletedSuccess('USER') : DeletedFailure('USER'));
      console.log(result[1] ? DeletedSuccess('ROLES') : DeletedFailure('ROLES'));
      console.log(result[2] ? DeletedSuccess('EBOOKS') : DeletedFailure('EBOOKS'));
      console.log(result[3] ? DeletedSuccess('GENRES') : DeletedFailure('GENRES'));
      console.log(result[4] ? DeletedSuccess('AUTHORS') : DeletedFailure('AUTHORS'));
      console.log(result[5] ? InsertedSuccess('ROLES') : InsertedFailure('ROLES'));
      console.log(result[6] ? InsertedSuccess('GENRES') : InsertedFailure('GENRES'));
      console.log(result[7] ? InsertedSuccess('AUTHORS') : InsertedFailure('AUTHORS'));
    })
  }).catch(error => console.error(error)) 
}

module.exports = SampleData
