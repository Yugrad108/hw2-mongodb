// import path from 'node:path';
export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

const toMilliseconds = ({ days = 0, hours = 0, minutes = 0, seconds = 0 }) =>
  1000 * (seconds + 60 * (minutes + 60 * (hours + 24 * days)));

export const FIFTEEN_MINUTES = toMilliseconds({ minutes: 15 });
export const ONE_DAY = toMilliseconds({ days: 1 });

// export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');

// export const SMTP = {
//   SMTP_HOST: 'SMTP_HOST',
//   SMTP_PORT: 'SMTP_PORT',
//   SMTP_USER: 'SMTP_USER',
//   SMTP_PASSWORD: 'SMTP_PASSWORD',
//   SMTP_FROM: 'SMTP_FROM',
// };

// // export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
// // export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// // export const CLOUDINARY = {
// //   CLOUD_NAME: 'CLOUD_NAME',
// //   API_KEY: 'API_KEY',
// //   API_SECRET: 'API_SECRET',
// // };
