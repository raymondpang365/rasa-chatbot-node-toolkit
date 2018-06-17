import assign from 'object-assign';
import nodemailer from 'nodemailer';
import { nodemailer as nodemailerConfig, mailOptions } from '../../config';

let defaultTransport;
if (nodemailerConfig) {
  defaultTransport = nodemailerConfig[process.env.NODE_ENV];
}

export default (transport = defaultTransport) => {
  const transporter = nodemailer.createTransport(transport);
  return {
    sendMail: options => new Promise((resolve, reject) => {
      options = assign(
        {},
        mailOptions.default,
        mailOptions[process.env.NODE_ENV],
        options
      );
      transporter.sendMail(mailOptions, (err, info) => {
        if (process.env.NODE_ENV !== 'test' && err) {
          return reject(err);
        }
        return resolve(info);
      });
    }),
  };
};
