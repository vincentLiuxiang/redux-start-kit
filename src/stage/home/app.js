import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from './action';
import News from '../../container/news';
import Tips from '../../container/tips';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return  (
      <div>
        <News />
        <Tips />
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {};
}


export default connect(
  mapStateToProps,actions
)(App);