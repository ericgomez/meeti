const ejs = require('ejs')
const nodemailer = require('nodemailer')

const emailConfig = require('../config/email')

const sendEmail = async options => {
  let transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: false, // true for 465, false for other ports
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass
    }
  })

  const html = await ejs.renderFile(
    `${__dirname}/../views/emails/${options.template}.ejs`,
    {
      url: options.url
    }
  )

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Meeti 👻" <noreply@meeti.com>', // sender address
    to: options.user.email, // list of receivers
    subject: options.subject, // Subject line
    html: html
  })

  return info
}

module.exports = sendEmail
