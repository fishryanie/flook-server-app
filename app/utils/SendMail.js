const nodemailer = require('nodemailer');
const RenderMailRegister = require('../Views/mail.signup')
const RenderMailPassword = require('../Views/mail.password')

const adminEmail = 'flex.bookingzz@gmail.com'
const adminPassword = 'flex123456'
const mailHost = 'smtp.gmail.com'
const mailPort = 465


const SendMail = async (toMail, subject, newPassword, userId) => {
  const transporter = nodemailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: true,
    auth: {
      user: adminEmail,
      pass: adminPassword
    },
  });
  const linkActiveAccount = `http://localhost:8000/api/user-management/setActiveUser/${userId}`

  const options = {
    from: adminEmail,
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


