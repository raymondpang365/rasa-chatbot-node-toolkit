import loadable from 'loadable-components';

import { ErrorDisplay, Loading } from '../../components/index';

export default loadable(() => import('./Search'), {
  ErrorComponent: ErrorDisplay,
  LoadingComponent: Loading
});
