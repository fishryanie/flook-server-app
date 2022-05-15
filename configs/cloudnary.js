require('dotenv/config')

const cloudinary = require('cloudinary').v2;

const configs = {
  cloud_name: process.env.ClOUDNARY_NAME, 
  api_key: process.env.ClOUDNARY_API_KEY, 
  api_secret: process.env.ClOUDNARY_API_SECRET,
  secure: process.env.ClOUDNARY_SECURE
}

cloudinary.config(configs);

module.exports = cloudinary;
