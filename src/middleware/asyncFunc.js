import {fetchSuccess} from '../common/js/request';

/**
 * user defined function
 * asyncFunc is just an example
 */
export default function asyncFunc (getState, next, action, cb = () => {}) {
  if (typeof action === 'function') {
    action = action(getState);
  }

  if (action.url) {
    fetchSuccess(action.url, action.init)
      .then(resJson => {
        if (action.dispatch === undefined || action.dispatch) {
          return cb(null, next(Object.assign({}, action, {data: resJson})));
        }
        cb(null, resJson);
      }, err => {
        console.error('URL', action.url, err.message);
        if (action.error) {
          let failAction = Object.assign(
            {},
            action,
            action.error,
            { text: action.error.text || err.message }
          );
          next(failAction);
        }
        err.type = action.type;
        cb(err);
      })
  } else {
    cb(null, next(action));
  }
}