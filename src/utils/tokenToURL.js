import { host, publicPort, hasDomainName, domainName } from '../config';

export default (baseURL, token) =>
  hasDomainName?
    `https://${domainName}${baseURL}?token=${token}`
    : `http://${host}:${publicPort}${baseURL}?token=${token}`;

