const oneHour = 3600 // 1 giờ 
const oneDay = 8640000 // 1 ngày


const addDays = numDays => {
  const today = new Date()
  today.setHours(7,0,0,0);
  today.setDate(today.getDate() + numDays)
  return today
}

const  addArrayDays = key => {
  let = array = []
  switch (key) { 
    case 'NEW': {
      for (let index = 11; index <= 15; index++) {
        array.push(addDays(index))
      }
      return array;
    }
    case 'COMMING_SOON': {
      for (let index = 4; index <= 10; index++) {
        array.push(addDays(index))
      }
      return array;
    }
    case 'ISPLAYING': {
      for (let index = -3; index <= 3; index++) {
        array.push(addDays(index))
      }
      return array
    }
    default: return array
  }

}

const FormatDate = {
  oneDay,
  oneHour,
  addDays,
  addArrayDays
}

module.exports = FormatDate