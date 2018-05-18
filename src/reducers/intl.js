import { Intl, Action } from '../types';
import messages from '../constants/i18n/en-us';

type State = Intl;

const initLocale = {
  locale: 'en-us',
  messages
};

export default (state: State = initLocale, action: Action) => {
  switch (action.type) {
    case 'UPDATE_LOCALE': {
      return {
        locale: action.locale,
        messages: action.messages
      };
    }
    default: {
      return state;
    }
  }
};
