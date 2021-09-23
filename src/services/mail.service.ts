
import { NotificatioEmail } from "../types";
require('dotenv').config()
// var mail = require('mail').Mail({
//   host: process.env.SMTP_HOSTNAME,
//   username: process.env.SMTP_USER,
//   password: process.env.SMTP_PASSWORD,
//   secure: process.env.SMTP_TLS,
//   port: process.env.SMTP_PORT,
// });

export class MailService {

  constructor() { }

  

  async sendNotificationMail(notificationEmail: NotificatioEmail): Promise<object> {
    // console.log('sending email...');
    const nodemailer = require("nodemailer");
    notificationEmail.from = process.env.SMTP_FROM ? process.env.SMTP_FROM : 'Didnt configure the from environment var';

    // return mail.message({
    //   from: notificationEmail.from,
    //   to: [notificationEmail.to],
    //   subject: notificationEmail.subject
    // })
    // .body(notificationEmail.content)
    // .send(function(err: any) {
    //   console.log(err);
    //   console.log('Sent!');
    // });

    // from: ,
    //   to: notificationEmail.to,
    //   subject: notificationEmail.subject,
    //   text: notificationEmail.content,
    //   html: "<b>" + notificationEmail.content + "</b>",

    
    notificationEmail.from = process.env.SMTP_FROM ? process.env.SMTP_FROM : 'Didnt configure the from environment var';
    const transportOpts = {
      host: process.env.SMTP_HOSTNAME,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_TLS, // true for 465, false for other ports
      auth: {
        type: 'LOGIN',
        user: process.env.SMTP_USER, // generated ethereal user
        pass: process.env.SMTP_PASSWORD, // generated ethereal password
      },
    };

    console.log(transportOpts);
    let transporter = nodemailer.createTransport(transportOpts);

    // send mail with defined transport object
    return await transporter.sendMail({
      from: notificationEmail.from,
      to: notificationEmail.to,
      subject: notificationEmail.subject,
      text: notificationEmail.content,
      html: "<b>" + notificationEmail.content + "</b>",
    }).then((info :any) => {

      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }).catch
    ((err:any) => {
      console.log(err);
      console.log('TODO.. not able to send emails with tls servers ?!');
    });
  }
}
