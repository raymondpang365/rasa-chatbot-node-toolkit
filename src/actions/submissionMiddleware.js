import { push } from 'connected-react-router';

import {emailLogin, emailRegister, loginUser} from "./user";
import {addStory} from "./story";
import { pushErrors } from "./error";

import {
  REGISTER,
  REGISTER_FAILURE,
  REGISTER_SUCCESS
} from "../reducers/registration";

import {
  SUBMIT_COMMENT,
  SUBMIT_COMMENT_FAILURE,
  SUBMIT_COMMENT_SUCCESS
} from "../reducers/submitComment";

import {
  LOGIN,
  LOGIN_FAILURE,
  LOGIN_SUCCESS
} from "../reducers/login";

import {
  SUBMIT_STORY,
  SUBMIT_STORY_FAILURE,
  SUBMIT_STORY_SUCCESS
} from "../reducers/submitStory";


const asyncSubmissionMiddleware = store => (next) => (
  action
) => {
  console.log('asyncRegisterMiddleware');
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

  if (action && action.type === SUBMIT_STORY) {
    store.dispatch(addStory(action.payload))
      .then(json => {
        store.dispatch({type: SUBMIT_STORY_SUCCESS });
        const { storyId } = json.data;
        store.dispatch(push(`/story/${storyId}`));
      }).catch((err) => {
      store.dispatch(pushErrors(err));
      if(err.response.data.errors[0].code === "USER_UNAUTHORIZED") {
        const payload =  { login: "Login failed. \nYou may have typed in a wrong email or password." };
        store.dispatch({type: SUBMIT_STORY_SUCCESS, payload });
      }
    })
  }

  if (action && action.type === SUBMIT_COMMENT) {
    store.dispatch(addStory(action.payload))
      .then(json => {
        store.dispatch({type: SUBMIT_COMMENT_SUCCESS });
        const { storyId } = json.data;
        store.dispatch(push(`/story/${storyId}`));
      }).catch((err) => {
      store.dispatch(pushErrors(err));
      if(err.response.data.errors[0].code === "USER_UNAUTHORIZED") {
        const payload =  { login: "Login failed. \nYou may have typed in a wrong email or password." };
        store.dispatch({type: SUBMIT_COMMENT_SUCCESS, payload });
        store.dispatch({})
      }
    })
  }
  return next(action);
};

export default asyncSubmissionMiddleware;
