require('dotenv/config')
const fs = require('fs'), nodemailer = require('nodemailer'), apiString = require('../constants/api')


const SendMail = async (req, res, toMail, subject, newPassword, userId) => {

  const apiActiveAccount = req.protocol + '://' + req.headers.host + apiString.setActiveUser + '?id=' + userId

  const apiForgotPassword = req.protocol + '://' + req.headers.host + apiString.forgotPassword + '?id=' + userId

  let renderMailRegister = fs
  .readFileSync(process.cwd() + '/views/email.hbs','utf8')
  .replace('RENDER_NEW_PASSWORD', newPassword)
  .replace('TEXT_API', apiActiveAccount)
  .replace('TEXT_SUBJECT', subject)
  .replace('TEXT_BUTTON', 'Activate your account')
  .replace('TEXT_DESCRIPTION', '')


  let renderMailForgotPassword = fs
  .readFileSync(process.cwd() + '/views/fogot.hbs', 'utf8')
  .replace('TEXT_API', apiForgotPassword)
  .replace('TEXT_SUBJECT', subject)
  .replace('TEXT_BUTTON', 'Update new password')
  .replace('TEXT_DESCRIPTION', '')

  const options = {
    from: process.env.FLOOK_EMAIL_USERNAME,
    to: toMail,
    subject: subject, 
    html: newPassword ? renderMailRegister : renderMailForgotPassword
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


