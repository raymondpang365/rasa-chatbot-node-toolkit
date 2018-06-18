import { normalize, arrayOf } from 'normalizr';
import { push } from 'connected-react-router'
import { userSchema } from '../schemas';
import Resources from '../constants/Resources';
import { setCookies, removeCookie } from './cookie';
import { setEntities } from './entity';
import { pushErrors } from './error';
import { setPages } from './page';
import userAPI from '../api/user';
import {
  REGISTER,
  REGISTER_SUCCESS,
  REGISTER_FAILURE
} from '../reducers/registration';
import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE
} from "../reducers/login";

export const loginUser = ({ token, info }, res = null) => dispatch => {
  console.log('again again ');
  console.log(token);
  console.log(info);
  dispatch(
    setCookies(
      {
        token,
        info
      },
      res
    )
  );
};

export const emailRegister = values =>
  async (dispatch, getState, apiEngine) => {
    try{
      const json = await userAPI(apiEngine).emailRegister(values);
      return json;
    } catch (err) {
      throw err;
    }
    };

export const emailLogin = values =>
  async (dispatch, getState, apiEngine) => {
    try{
      const json = await userAPI(apiEngine).emailLogin(values);
      return json
    } catch (err){
      throw err;
    }
  };

export const asyncSubmissionMiddleware = store => (next) => (
  action
) => {
  if (action && action.type === REGISTER) {
    store.dispatch(emailRegister(action.payload))
      .then(json => {
        const { data } = json;
        store.dispatch({type: REGISTER_SUCCESS });
        console.log('asyncRegisterMiddleware');
        console.log(data);
        console.log('asyncRegisterMiddleware');
        store.dispatch(loginUser({
          token: data.token,
          info: data.info,
        }));
        store.dispatch(push('/'));
      }).catch(err => {
        if(err.response.data.errors[0].code === "USER_EXISTED") {
          const payload = ({email: 'Email is already registered.'});
          store.dispatch({type: REGISTER_SUCCESS, payload});
        }
      })
    }
  if (action && action.type === LOGIN) {
    store.dispatch(emailLogin(action.payload))
      .then(json => {
        const { data } = json;
        store.dispatch(loginUser({
          token: data.token,
          info: data.info,
        }));
        store.dispatch({type: LOGIN_SUCCESS });
        store.dispatch(push('/'));
      }).catch((err) => {
        store.dispatch(pushErrors(err));
        if(err.response.data.errors[0].code === "USER_UNAUTHORIZED") {
          const payload =  { login: "Login failed. \nYou may have typed in a wrong email or password." };
          store.dispatch({type: LOGIN_SUCCESS, payload });
        }
      })
  }
  return next(action);
};




export const logoutUser = () =>
  async (dispatch, getState, apiEngine) => {
    console.log(apiEngine);
    try {
      const json = await userAPI(apiEngine).logout();

      /* istanbul ignore next */
      Promise.all([
        dispatch(removeCookie('token')),
        dispatch(removeCookie('info'))
      ]).then(()=> {
          console.log('redirect now!');

          dispatch(push('/'))
        }
      );
    } catch (err) {
      /* istanbul ignore next */
      alert('Logout user fail');
      throw err;
    }
  };

export const setUsers = res => dispatch => {
  const normalized = normalize(res.users, arrayOf(userSchema));

  dispatch(setEntities(normalized));
  dispatch(setPages(Resources.USER, res.page, normalized.result));
};

export const verifyEmail = token =>
  async (dispatch, getState, apiEngine) => {
  console.log('nana bibibo');
  console.log(getState());
  try {
    const json = await userAPI(apiEngine).verifyEmail({token});
    return json;
  }catch (err){
    console.log(err)
    throw err;
  }

};
