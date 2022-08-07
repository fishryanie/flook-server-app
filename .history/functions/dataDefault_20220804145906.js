'use strict';
const fs = require('fs');
const models = require('../models');
const dataDefaults = {
  users: require('../jsons/users.json'),
  roles: require('../jsons/roles.json'),
  ebooks: require('../jsons/ebooks.json'),
  genres: require('../jsons/genres.json'),
  authors: require('../jsons/authors.json'),
  reviews: require('../jsons/reviews.json'),
  chapters: require('../jsons/chapters.json'),
  comments: require('../jsons/comments.json'),
  features: require('../jsons/features.json'),
  stringCmt: require('../jsons/stringCmt.json'),
  featuresGroups: require('../jsons/featureGroups.json'),

}

const { randomArray, addArrayDays, randomInteger, randomDate } = require('./globalFunc');


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
 
      const arrayAuthors = await insert_many_author(arrayUsers)
      
      const arrayEbooks = await insert_many_ebooks(arrayGenres, arrayAuthors)

      const arrayReviews = await insert_many_reviews(arrayEbooks, arrayUsers)

      const arrayChapters = await insert_many_chapter(arrayEbooks, arrayUsers)

      const arrayFeatures = await insert_many_features(arrayRoles, arrayFeatureGroups)

      const arrayComments = await insert_many_comments(arrayUsers, arrayReviews, arrayChapters, arrayPosts)

      const updateCreateAtUser = await update_createAt_users(arrayUsers)

      const updateHistory = await update_history_users(arrayUsers, arrayEbooks, arrayChapters)

      const updateSubscribe = await update_subscribe_users(arrayUsers, arrayEbooks, arrayAuthors)

      const updateComments = await update_comments_to_comments(arrayUsers, arrayComments)


      arrayRoles && console.info('insertMany roles successfully', arrayRoles.length + ' data')

      arrayGenres && console.info('insertMany genres successfully', arrayGenres.length + ' data')

      arrayUsers && console.info('insertMany users successfully', arrayUsers.length + ' data')

      arrayAuthors && console.info('insertMany authors successfully', arrayAuthors.length + ' data')

      arrayEbooks && console.info('insertMany ebooks successfully', arrayEbooks.length + ' data')

      arrayChapters && console.info('insertMany chapters successfully', arrayChapters.length + ' data')

      arrayReviews && console.info('insertMany reviews successfully', arrayReviews.length + ' data')

      arrayComments && console.info('insertMany comments successfully', arrayComments.length + ' data')

      arrayFeatures && console.info('insertMany features successfully', arrayFeatures.length + ' data')

      arrayFeatureGroups && console.info('insertMany feature groups successfully', arrayFeatureGroups.length + ' data')

      updateHistory && console.info('updateMany history of user successfully')

      updateSubscribe && console.info('updateMany subscribe of users successfully')

      updateComments && console.info('updateMany comment of comment successfully')

      console.timeEnd()

    })
  }).catch(error => console.error(error)) 
}

module.exports = formatData


/** =======================||FUNCTIONS INSERT SAMPLE DATA ||=============================*/

async function insert_many_user(arrayRoles){
  const arrayUsers = []
  for (const user of dataDefaults.users) {
    for (const x in arrayRoles) { 
      for (const y in user.roles) {
        if(user.roles[y] === arrayRoles[x].name) {
          user.roles[y] = arrayRoles[x]._id
        }
      }
    } 
    arrayUsers.push(await new models.users({...user}).save())
  }
  return arrayUsers
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
    ebook.views = randomInteger(123,456)
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
  randomArray(dataDefaults.ebooks, 10).forEach((item, index) => {
    item.createAt = addArrayDays('EBOOKS_NEW')[index]
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
        if (chapter.likes[x] === arrayUsers[y].email) {
          chapter.likes[x] = arrayUsers[y]._id          
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

async function insert_many_comments(arrayUsers, arrayReviews, arrayChapters, arrayPosts){
  let dataComment=[]
  for (let index = 0; index < randomInteger(456,789); index++) {
    dataComment.push({
      userId: (arrayUsers.sort(() => 0.5 - Math.random())[0])._id,
      reviewId:(arrayReviews.sort(() => 0.5 - Math.random())[0])._id,
      content: dataDefaults.stringCmt[Math.floor(Math.random() * dataDefaults.stringCmt.length)],
      like: randomArray(arrayUsers, arrayUsers.length * randomInteger(10,90) / 100).map(user => user._id),
    })

    dataComment.push({
      userId: (arrayUsers.sort(() => 0.5 - Math.random())[0])._id,
      chapterId:(arrayChapters.sort(() => 0.5 - Math.random())[0])._id,
      content:  dataDefaults.stringCmt[Math.floor(Math.random() * dataDefaults.stringCmt.length)],
      like: randomArray(arrayUsers, arrayUsers.length * randomInteger(10,90) / 100).map(user => user._id),
    })
  } 
  return await models.comments.insertMany(dataComment)
}


/** =======================||FUNCTIONS FORMAT UPDATE SAMPLE DATA ||=============================*/

async function update_createAt_users(arrayUsers){
  arrayUsers.forEach(async user => {
    await models.users.updateOne(
      { _id: user._id }, 
      { createAt: randomDate(new Date(2018, 0, 0), new Date())},
      { new: true }
    );
  })
} 

async function update_history_users(arrayUsers, arrayEbooks, arrayChapters){
  arrayUsers.forEach(async user => {
    let arrayEbooksRandom = Array.from(new Set(randomArray(arrayEbooks, arrayEbooks.length * randomInteger(10,90) / 100))).map(item => item._id)    
    await models.users.updateOne({_id: user._id}, {'history.read.ebooks': arrayEbooksRandom}, { new: true });
  })
}

async function update_subscribe_users(arrayUsers, arrayEbooks, arrayAuthors) {
  arrayUsers.forEach(async user => {
    let arrayUsersRandome = Array.from(new Set(randomArray(arrayUsers, arrayUsers.length * randomInteger(10,90) / 100))).map(item => item._id)
    let arrayEbooksRandom = Array.from(new Set(randomArray(arrayEbooks, arrayEbooks.length * randomInteger(10,90) / 100))).map(item => item._id)
    let arrayAuthorRandom = Array.from(new Set(randomArray(arrayAuthors, arrayAuthors.length * randomInteger(10,90) / 100))).map(item => item._id)
    Promise.all([
      models.users.updateOne({_id: user._id}, {'subscribe.users': arrayUsersRandome}, { new: true }),
      models.users.updateOne({_id: user._id}, {'subscribe.ebooks': arrayEbooksRandom}, { new: true }),
      models.users.updateOne({_id: user._id}, {'subscribe.authors': arrayAuthorRandom}, { new: true }),
    ])
  })
}

async function update_comments_to_comments(arrayUsers, arrayComments){
  let dataComment=[]
  for (let index = 0; index < randomInteger(456,789); index++) {
    let userLike = randomArray(arrayUsers, arrayUsers.length * randomInteger(10,90) / 100).map(item => item._id)
    dataComment.push({
      userId: (arrayUsers.sort(() => 0.5 - Math.random())[0])._id,
      commentId:(arrayComments.sort(() => 0.5 - Math.random())[0])._id,
      content:  dataDefaults.stringCmt[Math.floor(Math.random() * dataDefaults.stringCmt.length)],
      like: userLike,
    })
  } 
  return await models.comments.insertMany(dataComment)
}


