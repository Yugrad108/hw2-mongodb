import nodemailer from 'nodemailer';

import { SMTP } from '../constants/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import createHttpError from 'http-errors';

const transporter = nodemailer.createTransport({
  host: getEnvVar(SMTP.SMTP_HOST),
  port: Number(getEnvVar(SMTP.SMTP_PORT)),
  auth: {
    user: getEnvVar(SMTP.SMTP_USER),
    pass: getEnvVar(SMTP.SMTP_PASSWORD),
  },
});

// export const sendEmail = async (options) => {
//   return await transporter.sendMail(options);
// };

export const sendEmail = async (options) => {
  try {
    await transporter.sendMail(options);
  } catch (err) {
    console.log(err);
    throw createHttpError(500, 'Error while sending email');
  }
};
