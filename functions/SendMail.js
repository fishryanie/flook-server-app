require('dotenv/config')
const nodemailer = require('nodemailer');
const RenderMailRegister = require('../emails/active-account')
const RenderMailPassword = require('../emails/send-password')

const SendMail = async (toMail, subject, newPassword, userId) => {
  const transporter = nodemailer.createTransport({
    host: process.env.FLOOK_EMAIL_HOST,
    port: process.env.FLOOK_EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.FLOOK_EMAIL_USERNAME,
      pass: process.env.FLOOK_EMAIL_PASSWORD
    },
  });
  const linkActiveAccount = `http://localhost:8000/api/user-management/setActiveUser/${userId}`

  const options = {
    from: process.env.FLOOK_EMAIL_USERNAME,
    to: toMail,
    subject: subject, 
    html: userId ? RenderMailRegister(linkActiveAccount) : RenderMailPassword(newPassword)
  }

  // send mail with defined transport object
  let info = await transporter.sendMail(options)

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
 
}

module.exports = SendMail


