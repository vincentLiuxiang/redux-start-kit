import async from 'easyasync';
import gap from 'gen-async-promise';


var asyncSeries = gap(transformArrayToMap);

function transformArrayToMap(funcs, cb) {
  async.series(funcs, (err, data) => {
    var dataMap = {};
    data.map(d => {
      dataMap[d.type] = d;
    })
    cb(err,dataMap);
  })
}

function createFunctionByArray (getState, next, actionArray, func) {
  return actionArray.map(function (action) {
    return func.bind(null, getState, next, action);
  });
}

function asyncInvokeAction (funcs) {
  return asyncSeries(funcs);
}

export const asyncMiddleWare = (asyncFunc) => store => next => action => {
  var childAction = action;
  if (typeof action === 'function') {
    childAction = action(store.getState);  
  }

  if (Object.prototype.toString.call(childAction) === '[object Object]') {
    childAction = [childAction];
  }

  if (Object.prototype.toString.call(childAction) === '[object Array]') {
    return asyncInvokeAction(
      createFunctionByArray(store.getState, next, childAction, asyncFunc)
    );
  }

  return next(action);
}
