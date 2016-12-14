import React,{Component} from 'react';
import {connect} from 'react-redux';
import Fresh from '../../com/fresh';
import News from '../../com/news';
import * as actions from './action';
import * as tipsAction from '../tips/action';
import './index.css';


class App extends Component{

  render () {

    let {
      refresh1,
      refresh2,
      refreshAll,
      clearAll,
      clear1,
      clear2,
      firNews,
      secNews,
      loadMessage,
      refreshAllDispatch
    } = this.props;

    return (
      <div>
        <div className='layout-level-top'>
          <Fresh onClick={(e) => {refreshAll();}} text={'所有新闻'}/>
          <Fresh onClick={(e) => {clearAll();}} text={'清除所有'}/>
        </div>

        <div className='layout-level-middle'>
          <Fresh onClick={(e) => {refresh1();}} text={'新闻一'}/>
          <Fresh onClick={(e) => {clear1();}} text={'清除新闻一'}/>
          <News news={firNews}/>
        </div>

        <div className='layout-level-foot'>
          <Fresh onClick={(e) => {refresh2();}} text={'新闻二'}/>
          <Fresh onClick={(e) => {clear2();}} text={'清除新闻二'}/>
          <News news={secNews}/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let {newsReducer} = state;
  return {
    firNews:newsReducer.firNews,
    secNews:newsReducer.secNews,
  };
}


export default connect(
  mapStateToProps, Object.assign({},actions,tipsAction)
)(App);