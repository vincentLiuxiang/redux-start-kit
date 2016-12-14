import * as types from './constant.js';

/**
 * [loadMessage description]
 * @param  {Object} opt [text,msgType]
 * @return {[Object]} [action Object]
 */
export function loadMessage (opt = {}) {
  return {
    ...opt,
    type: types.TIPS_MESSAGE_STAGE
  }
}

export function closeMessage () {
  return {
    type: types.TIPS_MESSAGE_CLOSE_STAGE
  }
}