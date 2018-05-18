import axios from 'axios';
import { cacheAdapterEnhancer } from 'axios-extensions';
import { host, port } from '../config';

const methods = ['get', 'post', 'put', 'patch', 'del'];

const formatUrl = path => `http://${host}:${port}${path}`;

export default class ApiEngine {
  constructor() {
    methods.forEach(method => {
      this[method] = (path, { params, data, files } = {}, { cache } = {}) => {
          const headers = {};
          const config = {};
          let payload;
          if (cache) {
            Object.assign(headers, { 'Cache-Control': 'no-cache' });
            Object.assign(config, {
              adapter: cacheAdapterEnhancer(axios.defaults.adapter, true)
            });
          }
          if (params) {
            payload = params;
          }
          if (data) {
            // console.log('data' + data);
            // console.log('formatUrl(path)' + formatUrl(path));
            Object.assign(headers, { 'Content-Type': 'application/json' });
            payload = data;
          }
          if (files) {
            const formData = new FormData();
            Object.keys(files).forEach(name => {
              formData.append(name, files[name]);
            });
            Object.assign(headers, { 'Content-Type': 'multipart/form-data' });
            payload = formData;
          }
          if ({ ...config, ...headers }) {
            console.log(`case 1 ${formatUrl(path)}`);
            console.log(payload);
            return axios[method](formatUrl(path), payload);
          } else {
            console.log(`case 2 ${formatUrl(path)}`);
            console.log(payload);
            console.log({...config, ...headers});
            return axios[method](formatUrl(path), payload, {...config, ...headers});
          }
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
