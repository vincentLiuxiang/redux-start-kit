import {params} from './utils.js';
// import fetch from 'isomorphic-fetch';
const defalutTimeout = 300000;
/*
 * fetch异步请求
 * url:'/user/test',
 * init:{
 *   默认值 GEI
 *   method:'POST/GET',
 *   当method不为 GET/HEAD时，默认值为application/json
 *   headers:{
 *     'Content-Type':'application/json'
 *   }
 *   timeout超时时间
 *   body是http请求body,传一个json对象,不需要JSON.stringify序列化
 *   body:{id:id}
 * }
 * 返回Promise对象
 */
export function fetchApi(url,init){
  init = init || {};
  init.headers = init.headers || {};

  var body = init.body;

  init.credentials = 'include'; //for pass cookie
  if (init.method && ['GET','get','HEAD','head'].indexOf(init.method) === -1) {
    init.headers['Content-Type'] = init.headers['Content-Type'] ||
      'application/json';
  }

  if (init.body) {
    init.method = init.method || 'POST';
  }

  if (init.method === 'POST'
    && init.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    init.body = params(init.body)
  }

  init.headers['X-Proxy-Timeout'] = init.timeout || defalutTimeout;


  if (Object.prototype.toString.call(init.body) === '[object Object]') {
    init.body = JSON.stringify(init.body);
  }

  return fetch(url,init).then((res) => {

    init.body = body;

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    return res.json();

  },(err) => {
    throw err;
  });
}


//get url: '/xxx/xxx?xxx=xxx&xxx=xxx',init 可选
//post url: '/xxx/xxx' init:{method:'POST',body:{xxx:xxx},headers:{ }}
//返回：Promise ;
//Fetch(url,init)
//       .then((data) =>{
//          ...
//        },(err) => {
//          ...
//        })
export function Fetch(url,init){
  return fetchApi(url,init)
}


// 后端接口 success:true/false
// 返回 后端返回对象的data部分
export function fetchSuccess (url,init) {
  return fetchApi(url,init).then((data) => {
    console.debug('fetch',url,data);

    if(!data.success){
      throw new Error(data.noteMsg || JSON.stringify(data));
    }

    return data.data;

  },(err) => {
    throw err;
  });
}


