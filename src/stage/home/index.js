import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'; // 不需要，仅作对比使用
import { createStore, applyMiddleware, compose} from 'redux'
import rootReducer from './reducer'
import {asyncMiddleWare} from '../../middleware/async-middleware';
import App from './app';

function configureStore(initialState) {
  const tools = window.devToolsExtension ? window.devToolsExtension() : f => f;
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(asyncMiddleWare),
      // applyMiddleware(thunk),
      module.hot ? tools : f => f
    )
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducer', () => {
      const nextRootReducer = require('./reducer').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}

let store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);