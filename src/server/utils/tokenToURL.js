import configs from '../../config';

export default (baseURL, token) =>
  `${configs.host[process.env.NODE_ENV]}${baseURL}?token=${token}`;
