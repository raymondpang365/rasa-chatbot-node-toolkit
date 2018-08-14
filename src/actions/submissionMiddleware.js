import { push, replace } from 'connected-react-router';

import {emailLogin, emailRegister, loginUser} from "./user";
import {addStory} from "./story";
import {addComment, appendCommentIntoList, fetchCommentsIfNeeded} from "./comments"
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
  if (action && action.type === REGISTER) {
    store.dispatch(emailRegister(action.payload))
      .then(json => {
        const { data } = json;
        store.dispatch({type: REGISTER_SUCCESS });
        console.log(data);

        store.dispatch(loginUser({
          token: data.token,
          info: data.info,
        }));
       // store.dispatch(push('/'));
      }).catch(err => {
      if(err.response.data.errors[0].code === "USER_EXISTED") {
        const payload = ({email: 'Email is already registered.'});
        store.dispatch({type: REGISTER_SUCCESS, payload});
      }
      else {
        store.dispatch({type: REGISTER_FAILURE, err });
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
       // store.dispatch(push('/'));
      }).catch((err) => {
      store.dispatch(pushErrors(err));
      if(err.response.data.errors[0].code === "USER_UNAUTHORIZED") {
        const payload =  { login: "Login failed. \nYou may have typed in a wrong email or password." };
        store.dispatch({type: LOGIN_SUCCESS, payload });
      }
      else {
        store.dispatch({type: LOGIN_FAILURE, err });
      }
    })
  }

  if (action && action.type === SUBMIT_STORY) {
    store.dispatch(addStory(action.payload))
      .then(json => {
        store.dispatch({type: SUBMIT_STORY_SUCCESS });
        console.log(json);
        const { storyId } = json.data;
        store.dispatch(push(`/story/${storyId}`));
      }).catch((err) => {
      store.dispatch(pushErrors(err));
      if(err.response.data.errors[0].code === "USER_UNAUTHORIZED") {
        const payload =  { login: "Login failed. \nYou may have typed in a wrong email or password." };
        store.dispatch({type: SUBMIT_STORY_SUCCESS, payload });
      } else{
        store.dispatch({type: SUBMIT_STORY_FAILURE, err });
      }
    })
  }

  if (action && action.type === SUBMIT_COMMENT) {
    if (store.getState().story.selected === 0)
      return store.dispatch({type: SUBMIT_COMMENT_FAILURE, err: "please wait" });

    console.log(store.getState().story.selected);
    console.log(action.payload);

    store.dispatch(addComment(store.getState().story.selected, action.payload))
      .then(json => {
        console.log(json);
        store.dispatch({type: SUBMIT_COMMENT_SUCCESS });
        store.dispatch(fetchCommentsIfNeeded(store.getState().story.selected));
        // const { comment } = json.data;
        // store.dispatch(appendCommentIntoList(comment));
      }).catch((err) => {
        store.dispatch(pushErrors(err));
        console.log(err);
        if(err.response.data.errors[0].code === "USER_UNAUTHORIZED") {
          const payload =  { login: "Login failed. \nYou may have typed in a wrong email or password." };
          store.dispatch({type: SUBMIT_COMMENT_SUCCESS, payload });
        }
        else {
          store.dispatch({type: SUBMIT_COMMENT_FAILURE, err });
        }
    })
  }
  return next(action);
};

export default asyncSubmissionMiddleware;
