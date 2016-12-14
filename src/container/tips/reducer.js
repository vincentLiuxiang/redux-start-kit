import * as types from './constant';

export default function tips (state = {}, action) {
  switch(action.type) {
    case types.TIPS_MESSAGE_STAGE:
    case types.TIPS_MESSAGE_CLOSE_STAGE:
      return action;
    default:
      return state;
  }
}