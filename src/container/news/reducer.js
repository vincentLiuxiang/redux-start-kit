import { combineReducers } from 'redux';
import * as types from './constant';

export default function news (state = {},action) {
  switch(action.type) {
    case types.REFRESH_SECOND:
      return Object.assign({},state,{secNews:action.data});
    case types.CLEAR_FIRST:
      return Object.assign({},state,{firNews:[]});
    case types.REFRESH_FIRST:
      return Object.assign({},state,{firNews:action.data});
    case types.CLEAR_SECOND:
      return Object.assign({},state,{secNews:[]});
    default:
      return state;
  }
}