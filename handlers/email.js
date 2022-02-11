const ejs = require('ejs')
const nodemailer = require('nodemailer')

const emailConfig = require('../config/email')

const sendEmail = async options => {
  let transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: false, // true for 465, false for other ports
    auth: {
      user: emailConfig.user, // generated ethereal user
      pass: emailConfig.pass // generated ethereal password
    }
  })

  console.log(options)

  //return info
}

module.exports = sendEmail
