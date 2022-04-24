const allowed = {
  uppers: "QWERTYUIOPASDFGHJKLZXCVBNM",
  lowers: "qwertyuiopasdfghjklzxcvbnm",
  numbers: "1234567890",
  symbols: "!@#$%^&*"
}

const getRandomCharFromString = (str) => str.charAt(Math.floor(Math.random() * str.length))
const generatePassword = (length = 16) => { // password will be @Param-length, default to 8, and have at least one upper, one lower, one number and one symbol
  let pwd = "";
  pwd += getRandomCharFromString(allowed.uppers); //pwd will have at least one upper
  pwd += getRandomCharFromString(allowed.lowers); //pwd will have at least one lower
  pwd += getRandomCharFromString(allowed.numbers); //pwd will have at least one number
  pwd += getRandomCharFromString(allowed.symbols);//pwd will have at least one symbolo
  for (let i = pwd.length; i < length; i++)
    pwd += getRandomCharFromString(Object.values(allowed).join('')); //fill the rest of the pwd with random characters
  return pwd
}

module.exports = generatePassword