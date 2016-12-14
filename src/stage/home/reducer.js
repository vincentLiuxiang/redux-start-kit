import { combineReducers } from 'redux';
import newsReducer from '../../container/news/reducer.js';
import tips from '../../container/tips/reducer.js';

const allReducer = combineReducers({
  newsReducer,tips
})

export default allReducer;