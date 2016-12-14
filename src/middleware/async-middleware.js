import async from 'easyasync';
import path from 'path';
import {fetchSuccess} from '../common/js/request';

//后期只需替换asyncFunc即可
function asyncFunc (action,next,cb) {
  if (action.url) {
    fetchSuccess(path.join(action.url),action.init)
      .then(resJson => {
        if(resJson){
          let thenAction = Object.assign({},action,{data:resJson});
          next(thenAction);
          cb(null);
        }
      },err => {
        console.error('URL',action.url,err.message);
        if (action.error) {
          let failAction = Object.assign({},action,action.error,{text:err.message || action.error.text});
          next(failAction);
        }
        cb(true);
      })

  } else {
    next(action);
    cb(null);
  }
}

function createFunctionByArray (actionArray,next,func) {
  return actionArray.map(function (action) {
    return func.bind(null,action,next);
  });
}


function asyncInvokeAction (funcs) {
  async.series(funcs);
}

/**
 * @param action.url 异步操作必需
 * 定义要获取的资源。这可能是：
 * 一个 USVString 字符串，包含要获取资源的 URL。
 * 一个 Request 对象。
 * 如果该action为异步操作，则该参数为必需
 *
 * @param action.type 必须
 * 定义一个异步操作类型
 *
 * @param action.error 异步执行必须
 *
 * @param action.init 可选
 * 一个配置项对象，包括所有对请求的设置。可选的参数有：
 * method: 请求使用的方法，如 GET、POST。
 * headers: 请求的头信息，形式为 Headers 对象或 ByteString。
 * body: 请求的 body 信息：可能是一个 Blob、BufferSource、FormData、URLSearchParams
 *       或者 USVString 对象。注意 GET 或 HEAD 方法的请求不能包含 body 信息。
 * mode: 请求的模式，如 cors、 no-cors 或者 same-origin。
 * credentials: 请求的 credentials，如 omit、same-origin 或者 include。
 * cache: 请求的 cache 模式: default, no-store, reload, no-cache, force-cache,
 *        or only-if-cached.
 * var action = {
 *   type:increaseAction.type,
 *   url:'/api/mockdata/test.json',
 *   init:{
 *     method:'POST',
 *     headers: {
 *       "Content-Type": "application/json"
 *     },
 *     body:JSON.stringify({user:'admin'})
 *   }
 * };
 */
export const asyncMiddleWare = store => next => action => {
  if (Object.prototype.toString.call(action) === '[object Object]') {
    if (!action.url) {
      return next(action);
    }
    return asyncInvokeAction(createFunctionByArray([action],next,asyncFunc));
  }

  if (Object.prototype.toString.call(action) === '[object Array]') {
    return asyncInvokeAction(createFunctionByArray(action,next,asyncFunc));
  }

  return next(action);
}
