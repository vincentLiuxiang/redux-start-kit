import * as types from './constant';
import {TIPS_MESSAGE_STAGE,TIPS_MESSAGE_CLOSE_STAGE} from '../tips/constant.js'
import {loadMessage,closeMessage} from '../tips/action.js'
import * as TIPS from '../tips/constant.js'
import {fetchSuccess} from '../../common/js/request.js'

export function refresh1 () {
  return (getState) => {
    console.log("@@@@",getState());
    return {
      type: types.REFRESH_FIRST,
      url: '/mock/getFirstNews.json',
      error: {
        type: TIPS.TIPS_MESSAGE_STAGE,
        msgType: 'warning',  // antd message
        text: '新闻一加载失败' //当后台没有错误信息时，使用该信息；
      }
    }
  }
}

export function clear1 () {
  return {
    type: types.CLEAR_FIRST
  }
}

export function refresh2 () {
  return (getState) => {
    console.log("@@@@2222",getState());    
    return {
      type: types.REFRESH_SECOND,
      url: '/mock/getSecondNews.json',
      error: {
        type: TIPS.TIPS_MESSAGE_STAGE,
        msgType: 'warning',  // antd message
        text: '新闻二加载失败' //当后台没有错误信息时，使用该信息；
      }
    }
  }
}

export function refreshAll () {
  return [
    loadMessage({msgType:'loading',text:'正在加载数据'}),
    refresh1(),
    refresh2(),
    closeMessage(),
    loadMessage({msgType:'success',text:'加载成功! '})
  ]
}

export function clear2 () {
  return {
    type: types.CLEAR_SECOND
  }
}

// thunk-redux这个丑陋的中间件用法
export function refreshAllDispatch () {
  return (dispatch, getState) => {
    dispatch(loadMessage({msgType:'loading',text:'正在加载数据'}));
    let act1 = refresh1();
    let act2 = refresh2();
    fetchSuccess(act1.url)
      .then(d => {
        act1.data = d;
        dispatch(act1);
        return fetchSuccess(act2.url);
      })
      .then(d => {
        act2.data = d;
        dispatch(act2);
        dispatch(closeMessage());
        dispatch(loadMessage({msgType:'success',text:'加载成功! '}));
      })
  }
}

// export function refreshAll () {
//   return [
//     // {
//     //   type:TIPS_MESSAGE_STAGE,
//     //   msgType:'loading',
//     //   text:'正在加载数据'
//     // },
//     loadMessage({msgType:'loading',text:'正在加载数据'}),
//     refresh1(),
//     refresh2(),
//     {
//       type: TIPS_MESSAGE_CLOSE_STAGE
//     },
//     // closeMessage(),
//     loadMessage({msgType:'success',text:'加载成功! '})
//     // {
//     //   type:TIPS_MESSAGE_STAGE,
//     //   msgType:'success',text:'加载成功! '
//     // }
//   ]
// }

export function clearAll () {
  return [
    clear1(),
    clear2()
  ]
}

