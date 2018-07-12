import axios from 'axios';
import { cacheAdapterEnhancer } from 'axios-extensions';
import { host, publicPort, hasDomainName, domainName } from '../config';

const methods = ['get', 'post', 'put', 'patch', 'del'];

const formatUrl = path =>
  hasDomainName?
    `https://${domainName}${path}`
    : `http://${host}:${publicPort}${path}`;
/*
const tough = require('tough-cookie');

const cookieJar = new tough.CookieJar();

if(typeof window === 'object') {
  const axiosCookieJarSupport = require('axios-cookiejar-support').default;

  cookieJar.setCookieSync(document.cookie, 'http://localhost:3000');
}
*/

export default class ApiEngine {
  constructor(req) {
    methods.forEach(method => {
      this[method] = (path, { params, data, files } = {}, { cache } = {}) => {
        const content = {
          method,
          url: formatUrl(path),
          withCredentials: true
        };
        const headers = {};
        const config = { };
        if (cache) {
          Object.assign(headers, { 'Cache-Control': 'no-cache' });
          Object.assign(config, {
            adapter: cacheAdapterEnhancer(axios.defaults.adapter, true)
          });
        }

        if (params) {
          Object.assign(content, { params });
        }
        if (data) {
          // console.log('data' + data);
          // console.log('formatUrl(path)' + formatUrl(path));
          Object.assign(headers, { 'Content-Type': 'application/json' });
          Object.assign(content, { data });
        }

        if (!(typeof window === 'object')) {
          console.log('goodgoodgoodgoodgoodgood');
          Object.assign(headers, { 'Cookie': req.get('cookie') });
        }
        /*  if(typeof window === 'object' && document.cookie !== null){
            console.log('yea');
            Object.assign(headers, { 'Cookie': document.cookie });
          } */

        if (files) {
          const formData = new FormData();
          Object.keys(files).forEach(name => {
            formData.append(name, files[name]);
          });
          Object.assign(headers, { 'Content-Type': 'multipart/form-data' });
          Object.assign(content, { data: formData });
        }
        if(Object.getOwnPropertyNames(headers).length !== 0) {
          Object.assign(content, {headers});
        }
        if(Object.getOwnPropertyNames(config).length !== 0) {
          Object.assign(content, {config});
        }
        console.log(content);
        return axios(content);
      };
    });
  }
  /*
   * There's a V8 bug where, when using Babel, exporting classes with only
   * constructors sometimes fails. Until it's patched, this is a solution to
   * "ApiClient is not defined" from issue #14.
   * https://github.com/erikras/react-redux-universal-hot-example/issues/14
   *
   * Relevant Babel bug (but they claim it's V8): https://phabricator.babeljs.io/T2455
   *
   * Remove it at your own risk.
   */
  static empty() {}
}
