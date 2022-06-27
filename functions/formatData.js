'use strict';
const { roles } = require('../models');
const models = require('../models')
const FormatDate = require('./FormatDate');
const dataDefaults = {
  users: require('../jsons/users.json'),
  roles: require('../jsons/roles.json'),
  ebooks: require('../jsons/ebooks.json'),
  genres: require('../jsons/genres.json'),
  authors: require('../jsons/authors.json'),
  reviews: require('../jsons/reviews.json'),
  chapters: require('../jsons/chapters.json'),
  features: require('../jsons/features.json'),
  featuresGroups: require('../jsons/featureGroups.json'),
}


const formatData = () => {

  console.time()

  Promise.all([
    models.users.deleteMany(),

    models.roles.deleteMany(),

    models.ebooks.deleteMany(),

    models.genres.deleteMany(),

    models.authors.deleteMany(),

    models.chapters.deleteMany(),

    models.reviews.deleteMany(),

    models.comments.deleteMany(),

    models.features.deleteMany(),

    models.featuresGroups.deleteMany()

  ]).then(response => {

    Promise.all([...response,

      models.roles.insertMany(dataDefaults.roles),

      models.genres.insertMany(dataDefaults.genres),

      models.featuresGroups.insertMany(dataDefaults.featuresGroups)

    ]).then(async response => {

      const arrayRoles = response[10], arrayGenres = response[11], arrayFeatureGroups = response[12], arrayPosts = []
   
      const arrayUsers = await insert_many_user(arrayRoles)

      // const arrayAuthors = await insert_many_author(arrayUsers)
      
      // const arrayEbooks = await insert_many_ebooks(arrayGenres, arrayAuthors)
     
      // const arrayChapters = await insert_many_chapter(arrayEbooks, arrayUsers)

      // const arrayReviews = await insert_many_reviews(arrayEbooks, arrayUsers)

      // const arrayFeatures = await insert_many_features(arrayRoles, arrayFeatureGroups)

      // const arrayComments = await insert_many_comments(arrayReviews, arrayChapters, arrayPosts)

      

      // update_history_users(arrayEbooks)


      arrayRoles && console.log('insertMany roles successfully')

      arrayGenres && console.log('insertMany genres successfully')

      // arrayUsers && console.log('insertMany users successfully')

      // arrayAuthors && console.log('insertMany authors successfully')

      // arrayEbooks && console.log('insertMany ebooks successfully')

      // arrayReviews && console.log('insertMany reviews successfully')

      // arrayFeatures && console.log('insertMany features successfully')

      // arrayComments && console.log('insertMany comments successfully')

      console.timeEnd()

    })
  }).catch(error => console.error(error)) 
}

module.exports = formatData


/** =======================||FUNCTIONS INSERT SAMPLE DATA ||=============================*/

async function insert_many_user(arrayRoles){
  for (const user of dataDefaults.users) {
    for (const x in arrayRoles) { 
      for (const y in user.roles) {
        if(user.roles[y] === arrayRoles[x].name) {
          user.roles[y] = arrayRoles[x]._id
        }
      }
    } 
    new models.users({...user}).save()
  }
}

async function insert_many_author(arrayUsers){
  dataDefaults.authors.forEach(author => {
    arrayUsers.forEach(user => {
      if(author.license && author.license === user.email){
        author.license = user._id
      }   
    })
  })
  return await models.authors.insertMany(dataDefaults.authors)
}

async function insert_many_ebooks(arrayGenres, arrayAuthors){
  dataDefaults.ebooks.forEach(ebook => {
    for (const x in arrayGenres) { 
      for (const y in ebook.genres) {
        if(ebook.genres[y] === arrayGenres[x].name){
          ebook.genres[y] = arrayGenres[x]._id
        }
      }
    } 
    for (const x in arrayAuthors) {
      for (const y in ebook.authors) {
        if(ebook.authors[y] === arrayAuthors[x].name){
          ebook.authors[y] = arrayAuthors[x]._id
        }
      }
    }
  })
  return await models.ebooks.insertMany(dataDefaults.ebooks)
}

async function insert_many_chapter(arrayEbooks, arrayUsers){
  dataDefaults.chapters.forEach(chapter => {
    arrayEbooks.forEach(ebook => {
      if(chapter.ebooks === ebook.title){
        chapter.ebooks = ebook._id
      }
    })
    for (const x in chapter.numLikes) {
      for (const y in arrayUsers) {
        if (chapter.numLikes[x] === arrayUsers[y].email) {
          chapter.numLikes[x] = arrayUsers[y]._id          
        }
      }
    }
  })
  return await models.chapters.insertMany(dataDefaults.chapters)
}

async function insert_many_reviews(arrayEbooks, arrayUsers){
  dataDefaults.reviews.forEach(review => {
    arrayEbooks.forEach(ebook => {
      if(review.ebooks === ebook.title){
        review.ebooks = ebook._id
      }
    })
    arrayUsers.forEach(user => {
      if(review.users === user.email){
        review.users = user._id
      }
    })
  })
  return await models.reviews.insertMany(dataDefaults.reviews)
}

async function insert_many_features(arrayRoles, arrayFeatureGroups){
  dataDefaults.features.forEach(feature => {
    for (const x in feature.roles) {
      for (const y in arrayRoles) {
        if(feature.roles[x] === arrayRoles[y].name){
          feature.roles[x] = arrayRoles[y]._id
        }
      }
    }
    arrayFeatureGroups.forEach(featureGroup => {
      if (feature.featureGroup === featureGroup.name) {
        feature.featureGroup = featureGroup._id        
      }
    })
  })
  return await models.features.insertMany(dataDefaults.features)
}

async function insert_many_comments(arrayReviews, arrayChapters, arrayPosts){
  
}


/** =======================||FUNCTIONS FORMAT UPDATE SAMPLE DATA ||=============================*/


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

async function update_history_users(arrayEbooks) {
  let randomReaded = random_elems(arrayEbooks, arrayEbooks.length * 20/100); 
  let randomDownloaded = random_elems(arrayEbooks, arrayEbooks.length * 30/100);


 
}

function random_elems(arr, count) {
  let len = arr.length;
  let lookup = {};
  let tmp = [];
 
  if (count > len) count = len;
 
  for (let i = 0; i < count; i++) {
    let index;
    do {
      index = ~~(Math.random() * len);
    } while (index in lookup);
    lookup[index] = null;
    tmp.push(arr[index]);
  }
 
  return tmp;
}


