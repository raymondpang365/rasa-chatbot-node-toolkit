import assign from 'object-assign';
import nodemailer from 'nodemailer';
import { nodemailer as nodemailerConfig, mailOptions } from '../../config';

let defaultTransport;
if (nodemailerConfig) {
  defaultTransport = nodemailerConfig;
}
export default (transport = defaultTransport) => {
  console.log(defaultTransport);
  console.log('defaultTransport');
  const transporter = nodemailer.createTransport(transport);
  return {
    sendMail: options => new Promise((resolve, reject) => {
      options = assign(
        {},
        mailOptions,
        options
      );
      console.log(options);
      transporter.sendMail(options, (err, info) => {
        if (err) {
          return reject(err);
        }
        return resolve(info);
      });
    }),
  };
};
