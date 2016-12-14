import React,{Component} from 'react';
import {connect} from 'react-redux';
import * as actions from './action';
import * as types from './constant';
import {message} from 'antd';

class App extends Component{

  shouldComponentUpdate (nProps, nState) {
    let {stage} = nProps;
    switch(stage.type) {
      case types.TIPS_MESSAGE_STAGE:
        this.hideMessage = message[stage.msgType](stage.text);
        return false;
      case types.TIPS_MESSAGE_CLOSE_STAGE:
        if (this.hideMessage) {
          this.hideMessage();
          this.hideMessage = null;
        }
        return false;
      default:
        return true;
    }
  }

  getView () {
    return null;
  }

  render () {
    return this.getView();
  }
}

function mapStateToProps(state) {
  let {tips} = state;
  return {stage:tips};
}


export default connect(
  mapStateToProps,actions
)(App);