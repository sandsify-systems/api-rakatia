import * as nodemailer from 'nodemailer';
import { log } from './logger';

export interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  html:string
}

const {
  NODEMAILER_SERVICE,
  NODEMAILER_USER,
  NODEMAILER_PASSWORD,
  NODEMAILER_SENDER
} = process.env;

const transporter = nodemailer.createTransport({
  service:  NODEMAILER_SERVICE as string | 'gmail',
  auth: {
    user: NODEMAILER_USER,
    pass: NODEMAILER_PASSWORD,
  },
});

export const sendEmail = async (receiverEmail: string, htmlTmeplate:string) => {
  const mailOptions: MailOptions = {
    from: NODEMAILER_SENDER as string | 'jidsfotech@gmail.com',
    to: receiverEmail,
    subject: 'Verify Account',
    text: 'Verify your email to complete signup process',
    html:htmlTmeplate
  };
  try {
    await transporter.sendMail(mailOptions);
    log.info(`Email sent to:- ${receiverEmail} sucessfully`);
  } catch (E) {
    log.error(`Error occured while sending to:- ${receiverEmail}`);
    log.error(E);
  }
};