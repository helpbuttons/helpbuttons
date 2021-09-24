
import { logger } from "../logger";
import { NotificatioEmail } from "../types";
require('dotenv').config()

const nodemailer = require("nodemailer");

const transportOpts = {
  host: process.env.SMTP_HOSTNAME,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true" ? true : false, // true for 465, false for other ports
  auth: {
    type: 'LOGIN',
    user: process.env.SMTP_USER, // generated ethereal user
    pass: process.env.SMTP_PASSWORD, // generated ethereal password
  },
};

const transporter = nodemailer.createTransport(transportOpts);


export class MailService {

  constructor() { }



  async sendNotificationMail(notificationEmail: NotificatioEmail): Promise<object> {
    if (process.env.ENV === 'production') {

      // send mail with defined transport object
      return transporter.sendMail({
        from: process.env.SMTP_FROM ? process.env.SMTP_FROM : 'Didnt configure the from environment var',
        to: notificationEmail.to,
        subject: notificationEmail.subject,
        text: notificationEmail.content,
        html: "<b>" + notificationEmail.content + "</b>",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }).then((info: any) => {
        logger.info("email sent! to %s subject %s", notificationEmail.to, notificationEmail.subject);
        return info;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }).catch((err: any) => {
        logger.error(err);
        logger.warn('failed to send email!');
      });
    }
    return Promise.resolve({});
  }
}