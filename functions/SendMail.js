require('dotenv/config')
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const routesString = require('../constants/routes')


const SendMail = async (req, res, toMail, subject, newPassword, userId) => {

  const apiActiveAccount = req.protocol + '://' + req.headers.host + routesString.setActiveUser + '?id=' + userId

  const apiChangePassword = req.protocol + '://' + req.headers.host + routesString.changePassword + '?id=' + userId

  let renderMailRegister = fs.readFileSync(process.cwd() + '/views/register.html','utf8').replace('LINK_ACTIVATE_ACCOUNT', apiActiveAccount).replace('RENDER_NEW_PASSWORD', newPassword)
  
  const options = {
    from: process.env.FLOOK_EMAIL_USERNAME,
    to: toMail,
    subject: subject, 
    html: renderMailRegister
  }
  
  const transporter = nodemailer.createTransport({
    host: process.env.FLOOK_EMAIL_HOST,
    port: process.env.FLOOK_EMAIL_PORT,
    // secure: true,
    services: 'gmail',
    auth: {
      user: process.env.FLOOK_EMAIL_USERNAME,
      pass: process.env.FLOOK_EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const info = await transporter.sendMail(options)

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  return info 
}

module.exports = SendMail


