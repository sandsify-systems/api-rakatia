import * as nodemailer from 'nodemailer';
import { log } from '../utils/logger';

export interface MailOptions {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  html: string
}

const {
  NODEMAILER_SERVICE,
  NODEMAILER_USER,
  NODEMAILER_PASSWORD,
  NODEMAILER_SENDER
} = process.env;

const transporter = nodemailer.createTransport({
  service: NODEMAILER_SERVICE as string | 'gmail',
  auth: {
    user: NODEMAILER_USER,
    pass: NODEMAILER_PASSWORD,
  },
});

export const sendEmail = async (data: MailOptions): Promise<void> => {
  const mailOptions: MailOptions = {
    from: NODEMAILER_SENDER as string,
    to: data.to,
    subject: data.subject,
    text: data.text || '',
    html: data.html
  };
  try {
    await transporter.sendMail(mailOptions);
    log.info(`Email sent to:- ${data.to} sucessfully`);
  } catch (E) {
    log.error(`Error occured while sending to:- ${data.to}`);
    log.error(E);
  }
};