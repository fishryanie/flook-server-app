const cloudinary = require('cloudinary').v2;

const CLOUD_NAME = 'dwnucvodc'
const API_KEY = '856378275752831'
const API_SECRET = 'jwwDcwAf7Eev2U4TSN6scAPjdhY'
const SECURE = true

cloudinary.config({ 
  cloud_name: CLOUD_NAME, 
  api_key: API_KEY, 
  api_secret: API_SECRET,
  secure: SECURE
});



module.exports = cloudinary;
