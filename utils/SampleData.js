const handleError = require('../error/HandleError');
const FormatDate = require('./FormatDate');
const dataDefaults = {
  user: require('../data/initialize/user.json'),
  roles: require('../data/initialize/roles.json'),
  genres: require('../data/initialize/genres.json'),
  authors: require('../data/initialize/author.json'),
}

const { 
  MODEL_ROLES,  
  MODEL_USERS, 
  MODEL_AUTHORS, 
  MODEL_GENRES,
  MODEL_MANGAS 
} = require('../models')


const InsertedSuccess = collectionString => `Inserted ${collectionString} Success`
const InsertedFailure = collectionString => `Inserted ${collectionString} Failure`
const UpdatedSuccess = collectionString => `Updated ${collectionString} Success`
const UpdatedFailure = collectionString => `Updated ${collectionString} Failure`
const DeletedSuccess = collectionString => `Deleted ${collectionString} Success`
const DeletedFailure = collectionString => `Deleted ${collectionString} Failure`


const SampleData = {
  insert_data: async () => {
    Promise.all([
      MODEL_USERS.deleteMany(), 
      MODEL_ROLES.deleteMany(), 
      MODEL_MANGAS.deleteMany(), 
      MODEL_GENRES.deleteMany(), 
      MODEL_AUTHORS.deleteMany()
    ]).then(result => {
      Promise.all([...result,
        MODEL_ROLES.insertMany(dataDefaults.roles),
        MODEL_GENRES.insertMany(dataDefaults.genres),
        MODEL_AUTHORS.insertMany(dataDefaults.authors),
      ]).then(result => {
        let USER
        if(result[0] && result[5].length > 0){
          for (let indexUser in dataDefaults.user) {
            for (let indexRole in result[5]) {
              if(dataDefaults.user[indexUser].roles === result[5][indexRole].name) {
                dataDefaults.user[indexUser].roles = result[5][indexRole]._id
                USER = new MODEL_USERS(dataDefaults.user[indexUser]).save()
              }
            } 
          }
        }
        if(result[3] && result[6].length > 0 && result[7].length > 0){
          
        }



        console.log(result[0] ? DeletedSuccess('USER') : DeletedFailure('USER'));
        console.log(result[1] ? DeletedSuccess('ROLES') : DeletedFailure('ROLES'));
        console.log(result[2] ? DeletedSuccess('EBOOKS') : DeletedFailure('EBOOKS'));
        console.log(result[3] ? DeletedSuccess('GENRES') : DeletedFailure('GENRES'));
        console.log(result[4] ? DeletedSuccess('AUTHORS') : DeletedFailure('AUTHORS'));

        console.log(result[5] ? InsertedSuccess('ROLES') : InsertedFailure('ROLES'));
        console.log(result[6] ? InsertedSuccess('GENRES') : InsertedFailure('GENRES'));
        console.log(result[7] ? InsertedSuccess('AUTHORS') : InsertedFailure('AUTHORS'));

        console.log(USER ? InsertedSuccess('USER') : InsertedFailure('USER'));
      })
    }).catch(error => console.log(error))
  },

  edit_date_ebooks: async () => {
    const count = await MODEL_MANGAS.count()
    const EBOOKS = await MODEL_MANGAS.aggregate([{ $sample: { size: count/4 } }])
    const booksnews = FormatDate.addArrayDays('EBOOKS_NEW')
    let tam = -1, result=[]
    for (let doc in EBOOKS) {
      tam ++
      if(tam > booksnews.length) tam = 0
      result = await MODEL_MANGAS.updateOne(
        { title: doc.title}, 
        { $set: {createAt: booksnews[tam]}},
        { upsert: true}
      )
    }
    console.log(result.length > 0 ? UpdatedSuccess('EBOOKS') : UpdatedFailure('EBOOKS'))
  }
}

module.exports = SampleData
