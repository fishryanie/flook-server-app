const { MODEL_MOVIES } = require('../models')
const FormatDate = require('./FormatDate')


const FormatDate_New = FormatDate.addArrayDays('NEW')
const FormatDate_Isplaying = FormatDate.addArrayDays('ISPLAYING')
const FormatDate_CommingSoon = FormatDate.addArrayDays('COMMING_SOON')



const ArrayDateMovieNew = [], ArrayDateIsplaying = [], ArraydateCommingSoon = []
let amountData = 0, skip= 0, limit= 0, count = -1, premiere= []



const countDataMovie = async () => {
  try {
    const result = await MODEL_MOVIES.count()
    amountData = result
  } catch (error) {
    console.log(error)
  }
}


const shareDataMovie = async () => {
  const amount_data_isplaying = parseInt(amountData * 0.35)
  const amount_data_commingSoon = parseInt(amountData * 0.35)
  const amount_data_new = amountData - (amount_data_isplaying + amount_data_commingSoon)

  for (let index = 0; index < amount_data_new; index++) {
    count ++
    let item = count >= FormatDate_New.length ? count = 0 : count
    ArrayDateMovieNew.push(FormatDate_New[item])  
  }

  for (let index = 0; index < amount_data_isplaying; index++) {
    count ++
    let item = count >= FormatDate_Isplaying.length ? count = 0 : count
    ArrayDateIsplaying.push(FormatDate_Isplaying[item])  
  }

  for (let index = 0; index < amount_data_commingSoon; index++) {
    count ++
    let item = count >= FormatDate_CommingSoon.length ? count = 0 : count
    ArraydateCommingSoon.push(FormatDate_CommingSoon[item])  
  }

  for (let index = 0; index < 3; index++) {
    await updatePremiere(
      index, 
      amount_data_isplaying,
      amount_data_commingSoon,
      amount_data_new
    ) 
  }
}


const updatePremiere = async (share, limit01, limit02, limit03) => {
  if (share === 0) {
    skip = 0
    limit = limit01
    premiere = [...ArrayDateIsplaying]
  }else if (share === 1){
    skip = limit01
    limit = limit02
    premiere = [...ArraydateCommingSoon]
  }else if (share === 2){
    limit = limit03
    premiere = [...ArrayDateMovieNew]
    skip = limit01 + limit02
  }

  try {
    const result = await MODEL_MOVIES.find().limit(limit).skip(skip)
    if(result.length){
      result.forEach(async (doc, index) => {
        const doc_premiere = doc.premiere !== null && doc.premiere.toLocaleDateString('en-GB')
        const index_premiere = premiere[index].toLocaleDateString('en-GB')
        if(doc_premiere !== index_premiere || doc.premiere === null){
          doc.premiere = premiere[index] 
          await doc.save()
          .then(()=> console.log('update new premiere successfully'))
          .catch(err => console.log(err))
        }
      })
    }
  } catch (error) {
    console.log(error)
  }
}


exports.Main = async () => {
  await countDataMovie()
  await shareDataMovie()
}