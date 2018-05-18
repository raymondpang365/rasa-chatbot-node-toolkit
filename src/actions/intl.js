import localeAPI from '../api/locale';
import { setCookie } from './cookie';

import type { Dispatch, GetState, ThunkAction } from '../types';

const updateLocale = (targetLocale): ThunkAction => (
  dispatch: Dispatch,
  getState: GetState,
  apiEngine
) => {
  const currentLocale = getState().intl.locale;
  if (targetLocale === currentLocale) {
    return Promise.resolve();
  }
  return localeAPI(apiEngine)
    .read(targetLocale)
    .then(
      json => {
        dispatch(setCookie('locale', json.locale));
        dispatch({
          type: 'UPDATE_LOCALE',
          locale: json.locale,
          messages: json.messages
        });
      },
      err => {
        dispatch(setCookie('locale', currentLocale));
        return Promise.reject(err);
      }
    );
};

export default updateLocale;
